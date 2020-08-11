import * as React from "react"
import {withRouter} from "react-router-dom"
import "styled-components/macro"

import { Box, Text, ResponsiveContext, Layer } from "grommet"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Confetti } from "./Icon"
import { WithRouterProps } from "./Session";

type Props = WithFirebaseProps & WithRouterProps & {
  onDismiss: Function
}

const Authenticate = ({ firebase, history, onDismiss }: Props): JSX.Element => {
  const size = React.useContext(ResponsiveContext)
  const sizeIsSmall = size === "small"

  const oAuthUiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.authProvider.GoogleAuthProvider.PROVIDER_ID,
      firebase.authProvider.GithubAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (usr: firebase.User) => {
        onDismiss()
        return false
      }
    }
  };

  return (
    <Layer
      responsive={false}
      full="horizontal"
      position="top"
      onEsc={() => onDismiss()}
      onClickOutside={() => onDismiss()}
      css="border-radius: 0"
    >
      <Box fill="horizontal" pad="medium" animation="slideDown" justify="center" align="center">
        <Box direction="row" align="center" justify="center" gap="medium">
          <Box pad="small"><Confetti size={sizeIsSmall ? "large" : "medium-large"} color="plain" /></Box>
          <Box pad="small"><Text size={sizeIsSmall ? "medium" : "large"}>Sign in or create an account to start collecting patterns!</Text></Box>
        </Box>
        <Box pad="medium" align="center">
          <StyledFirebaseAuth uiConfig={oAuthUiConfig} firebaseAuth={firebase.auth}/>
        </Box>
      </Box>
    </Layer>
  )
}

export default withRouter(withFirebase(Authenticate));
