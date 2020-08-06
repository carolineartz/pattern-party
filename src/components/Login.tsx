import * as React from "react"
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import GoogleButton from 'react-google-button'
import { Box, Text } from "grommet"
import "styled-components/macro"

import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Confetti } from "./Icon"
import * as ROUTES from "./../constants/routes"

type WithRouterProps = {
  history: any
}

type Props = WithFirebaseProps & WithRouterProps

const GoogleAuth = ( {firebase, history }: Props): JSX.Element => {
  const handleClickSignIn = () => {
    firebase.doSignInWithGoogle().then(() => {
      history.push(ROUTES.LANDING)
    })
  }

  return (
    <Box fill="horizontal" pad="large" animation="slideDown" justify="center" align="center">
      <Box direction="row" align="center" justify="center">
        <Box pad="small"><Confetti size="medium-large" color="plain" /></Box>
        <Text size="large">Sign in or create an account to start collecting patterns!</Text>
      </Box>
      <Box pad="medium" align="center">
        <GoogleButton onClick={handleClickSignIn} />
      </Box>
    </Box>
  )
}

export default compose<Props, {}>(
  withRouter,
  withFirebase,
)(GoogleAuth);
