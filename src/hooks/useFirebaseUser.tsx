import React from 'react';
import Firebase from "../components/Firebase"

export const useFirebaseUser = ({firebase}: {firebase: Firebase}) => {
  // const currentUser = firebase.auth.currentUser
  // const [authUser, setAuthUser] = React.useState<firebase.User | undefined>(currentUser || undefined)

  return React.useCallback(
    async (currentUser: firebase.User) => {
      const snapshot = await firebase.user(currentUser.uid).get();
      const dbUser: firebase.firestore.DocumentData | undefined = snapshot.data();
      if (dbUser && !dbUser.roles) {
        dbUser.roles = {};
        firebase.authUser = { ...currentUser, ...(dbUser || { roles: {} }) };
      }
      else {
        firebase.authUser = currentUser;
      }
      return firebase.authUser
    },
    [firebase],
  );
};
