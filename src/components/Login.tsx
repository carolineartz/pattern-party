import * as React from "react"
import {withRouter} from "react-router-dom"
import "styled-components/macro"

import { Box, Text } from "grommet"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Confetti } from "./Icon"
import { WithRouterProps } from "./Session";
import * as ROUTES from "./../constants/routes"

const Authenticate = ({ firebase, history }: WithFirebaseProps & WithRouterProps): JSX.Element => {
  const [signedIn, setSignedIn] = React.useState<boolean>(false)

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInSuccessUrl: '/',
    signInFlow: 'redirect',
    signInOptions: [
      firebase.authProvider.GoogleAuthProvider.PROVIDER_ID,
      firebase.authProvider.GithubAuthProvider.PROVIDER_ID,
      firebase.authProvider.EmailAuthProvider.PROVIDER_ID
    ],
    // callbacks: {
    //   // Avoid redirects after sign-in.
    //   signInSuccessWithAuthResult: () => false
    // }
  };

  React.useEffect(() => {
    let unregisterAuthObserver: firebase.Unsubscribe
    let anotherObserver: firebase.Unsubscribe

    if (firebase.authUser) {
      setSignedIn(true)
    }

    else if (!signedIn) {
      unregisterAuthObserver = firebase.auth.onIdTokenChanged((authUser: firebase.User | null) => {
        // console.log("authUser", authUser)
        if (authUser) {
          firebase.user(authUser.uid).get().then(snapshot => {
            const dbUser: firebase.firestore.DocumentData | undefined = snapshot.data();
            // console.log("dbUser", dbUser)
            if (!authUser) {
              history.push(ROUTES.LANDING)
              firebase.authUser = undefined
              setSignedIn(false)
            } else {
              // default empty roles
              if (dbUser && !dbUser.roles) {
                dbUser.roles = {};
              }

              firebase.authUser = { ...authUser, ...(dbUser || { roles: {} }) }
              setSignedIn(true)
            }
          });
        } else {
          firebase.authUser = undefined

          if (history.location.pathname !== ROUTES.LANDING) {
            history.push(ROUTES.LANDING)
          }
        }
      });
    }

    anotherObserver = firebase.auth.onAuthStateChanged(() => {
      console.log("AUTH STATE CHANGED")
    })

    return () => {
      if (unregisterAuthObserver) {
        console.log("unmounting and unregistering observer");
        unregisterAuthObserver()
      }

      anotherObserver()

      console.log("unmounting only");
    }
  }, [history, setSignedIn, signedIn, firebase])

  return (
    <Box fill="horizontal" pad="large" animation="slideDown" justify="center" align="center">
      <Box direction="row" align="center" justify="center" gap="small">
        <Box pad="small"><Confetti size="medium-large" color="plain" /></Box>
        <Text size="large">Sign in or create an account to start collecting patterns!</Text>
      </Box>
      <Box pad="medium" align="center">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth}/>
      </Box>
    </Box>
  )
}

export default withRouter(withFirebase(Authenticate));
