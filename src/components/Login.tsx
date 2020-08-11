import * as React from "react"
import "styled-components/macro"

import { Box, Text, ResponsiveContext } from "grommet"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Confetti } from "./Icon"

const Authenticate = ({ firebase }: WithFirebaseProps): JSX.Element => {
  const size = React.useContext(ResponsiveContext)
  const sizeIsSmall = size === "small"

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
    <Box fill="horizontal" pad="medium" animation="slideDown" justify="center" align="center">
      <Box direction="row" align="center" justify="center" gap="medium">
        <Box pad="small"><Confetti size={sizeIsSmall ? "large" : "medium-large"} color="plain" /></Box>
        <Box pad="small"><Text size={sizeIsSmall ? "medium" : "large"}>Sign in or create an account to start collecting patterns!</Text></Box>
      </Box>
      <Box pad="medium" align="center">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth}/>
      </Box>
    </Box>
  )
}

export default withFirebase(Authenticate);
