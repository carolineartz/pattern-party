import * as React from "react"
import "styled-components/macro"

import { Box, Text } from "grommet"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Confetti } from "./Icon"

const Authenticate = ({ firebase }: WithFirebaseProps): JSX.Element => {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.authProvider.GoogleAuthProvider.PROVIDER_ID,
      firebase.authProvider.GithubAuthProvider.PROVIDER_ID,
      firebase.authProvider.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

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

export default withFirebase(Authenticate);
