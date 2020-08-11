import React from 'react';
import Firebase from "../components/Firebase"

export const useFirebaseUser = ({firebase}: {firebase: Firebase}) => {
  // const currentUser = firebase.auth.currentUser
  // const [authUser, setAuthUser] = React.useState<firebase.User | undefined>(currentUser || undefined)

  return React.useCallback(
    (currentUser) => {
      if (currentUser) {
        firebase.user(currentUser.uid).get().then(snapshot => {
          const dbUser: firebase.firestore.DocumentData | undefined = snapshot.data();

          if (dbUser && !dbUser.roles) {
            dbUser.roles = {};
            firebase.authUser = { ...currentUser, ...(dbUser || { roles: {} }) }
          } else {
            firebase.authUser = currentUser
          }
        });
      } else {
        firebase.authUser = undefined
      }

      return firebase.authUser
    },
    [firebase],
  );
};
