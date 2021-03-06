
import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/auth';

type FirebaseAuthProvider = typeof firebase.auth

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

interface AuthUser extends firebase.User {
  roles: Record<string, boolean>
}

export interface IFirebase {
  db: firebase.firestore.Firestore
  auth: firebase.auth.Auth
  authUser?: firebase.User
  authProvider: FirebaseAuthProvider
  googleProvider: firebase.auth.GoogleAuthProvider

  onAuthUserListener: (next: (user: firebase.User) => any, fallback: Function) => firebase.Unsubscribe
  doSignInWithGoogle: () => Promise<firebase.auth.UserCredential>
  doSignOut: () => Promise<void>

  user: (uid: string) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

  patternCollection: () => firebase.firestore.CollectionReference
  patterns: (limit?: number) => firebase.firestore.Query<PatternType>
  featuredPatterns: (limit: number) => firebase.firestore.Query<PatternType>
  pattern: (pid: string) => firebase.firestore.DocumentReference<PatternType>

  userPatternCollection: (uid: string) => firebase.firestore.CollectionReference
  userPatterns: (uid: string, limit: number) => firebase.firestore.Query<PatternType>
  userPattern: (uid: string, upid: string) => firebase.firestore.DocumentReference<PatternType>
}

class Firebase implements IFirebase {
  db: firebase.firestore.Firestore
  auth: firebase.auth.Auth
  authProvider: FirebaseAuthProvider
  googleProvider: firebase.auth.GoogleAuthProvider
  authUser?: firebase.User

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
    this.authProvider = firebase.auth

    /* Social Sign In Method Provider */

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  }

  // *** Auth API ***

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
  doSignOut = async () => {
    await this.auth.signOut();
    this.authUser = undefined;
  }


  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next: (user: firebase.User) => any, fallback: Function) =>
    this.auth.onIdTokenChanged((authUser: firebase.User | null) => {
      if (authUser) {
        this.user(authUser.uid).get().then(snapshot => {
          const dbUser: firebase.firestore.DocumentData | undefined = snapshot.data();
          if (!authUser) {
            return fallback()
          } else {
            // default empty roles
            if (dbUser && !dbUser.roles) {
              dbUser.roles = {};
            }
            this.authUser = { ...authUser, ...(dbUser || { roles: {} }) }
            next(this.authUser);
          }
          });
      } else {
        // debugger
        fallback();
      }
    });

    // *** User API ***
    user = (uid :string) => this.db.doc(`users/${uid}`);

    // *** Community Patterns API ***
    patternCollection = () => this.db.collection("patterns")
    patterns = (limit?: number) => {
      if (limit) {
        return this.db.collection("patterns").withConverter(patternConverter).orderBy("createdAt", "desc").limit(limit)
      } else {
        return this.db.collection("patterns").withConverter(patternConverter).orderBy("createdAt", "desc")
      }
    }

    pattern = (pid: string) =>
      this.db.collection("patterns")
        .withConverter(patternConverter)
        .doc(pid)

    featuredPatterns = (limit = 10) =>
      this.patternCollection()
        .where("featured", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .withConverter(patternConverter)

    // *** User Patterns API ***
    userPatternCollection = (uid: string) => this.user(uid).collection("patterns")
    userPatterns = (uid: string, limit = 10) =>
      this.userPatternCollection(uid)
        .withConverter(patternConverter)
        .orderBy("createdAt", "desc")
        .limit(limit)

    userPattern = (uid: string, upid: string) =>
      this.user(uid).collection("patterns")
        .withConverter(patternConverter)
        .doc(upid)
}

export const patternConverter: firebase. firestore. FirestoreDataConverter<PatternType> = {
  toFirestore(pattern: Omit<PatternType, 'id'>): firebase.firestore.DocumentData {
    return {
      markup: pattern.markup,
      createdAt: pattern.createdAt!,
      hidden: pattern.hidden,
      featured: pattern.featured,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): PatternType {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      markup: data.markup,
      createdAt: data.createdAt,
      hidden: data.hidden === "undefined" ? false : data.hidden,
      featured: data.hidden === "undefined" ? false : data.featured,
    }
  }
};

export default Firebase;
