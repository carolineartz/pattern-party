
import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/analytics';

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

class Firebase {
  db: firebase.firestore.Firestore

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
      firebase.analytics();
    } else {
      firebase.app()
    }

    this.db = firebase.firestore()
  }

  patterns = () => this.db.collection("patterns")
  pattern = (id: string) => this.patterns().doc(id)
}

export default Firebase;
