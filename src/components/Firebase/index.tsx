import FirebaseContext, { withFirebase } from './context'
import Firebase, { patternConverter } from './firebase';

export default Firebase;

export { FirebaseContext, withFirebase, patternConverter };

export type WithFirebaseProps = { firebase: Firebase, children?: React.ReactNode }
export type DatabaseStatus = "connected" | "disconnected" | "unknown";
export type AuthUser = firebase.User

export const LIMIT = 10
