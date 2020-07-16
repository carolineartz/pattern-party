
import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/auth';

// Your web app's Firebase configuration
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export interface IFirebase {
  db: firebase.firestore.Firestore
  auth: firebase.auth.Auth
  googleProvider: firebase.auth.GoogleAuthProvider

  doSignInWithGoogle: () => Promise<firebase.auth.UserCredential>
  doSignOut: () => Promise<void>

  users: () => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  user: (uid: string) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

  patterns: () => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  pattern: (pid: string) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

  userPatterns: (uid: string) => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  userPattern: (uid: string, upid: string) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

  // FIXME: remove me
  hidden: () => firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  hiddenPattern: (hp: string) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
}

class Firebase implements IFirebase {
  db: firebase.firestore.Firestore
  auth: firebase.auth.Auth
  googleProvider: firebase.auth.GoogleAuthProvider

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
      firebase.analytics();
    } else {
      firebase.app()
    }

    /* Firebase APIs */

    this.auth = firebase.auth()
    this.db = firebase.firestore()

    /* Social Sign In Method Provider */

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  // *** Auth API ***

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
  doSignOut = () => this.auth.signOut();


  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next: (user: firebase.User) => any, fallback: Function) =>
    this.auth.onAuthStateChanged((authUser: firebase.User | null) => {
      if (authUser !== null) {
        this.user(authUser.uid).get().then(snapshot => {
          const dbUser: firebase.firestore.DocumentData | undefined = snapshot.data();

          if (!dbUser || !authUser) { return fallback() }

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            next({...authUser, ...dbUser});
          });
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = (uid :string) => this.db.doc(`users/${uid}`);
  users = () => this.db.collection('users');

  // *** User Patterns API ***
  userPatterns = (uid: string) => this.user(uid).collection("patterns")
  userPattern = (uid: string, upid: string) => this.user(uid).collection("patterns").doc(upid)

  // *** Community Patterns API ***
  patterns = () => this.db.collection("patterns")
  pattern = (pid: string) => this.patterns().doc(pid)

  // *** Hidden Patterns API ***
  hidden = () => this.db.collection("hidden")
  hiddenPattern = (hid: string) => this.hidden().doc(hid)
}

export default Firebase;
