import * as React from "react"
import "styled-components/macro"

import { withFirebase, WithFirebaseProps } from "./../Firebase"
// import { useDeviceDetect } from "./../../hooks/useDeviceDetect"
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Box, Text } from "grommet"
import * as ROUTES from "./../../constants/routes"
import GoogleButton from 'react-google-button'
import { ReactComponent as Logo } from "./../../images/logo-p.svg"


type WithRouterProps = {
  history: any
}

type Props = WithFirebaseProps & WithRouterProps

const GoogleAuth = ( {firebase, history }: Props): JSX.Element => {
  // const [error, setError] = React.useState<string | null>(null)
  const handleClickSignIn = () => {
    firebase.doSignInWithGoogle().then(() => {
      history.push(ROUTES.LANDING)
    })
  }
    return (
      <Box fill="horizontal" direction="row" animation="slideDown">
        <Box pad="small"><Logo /></Box>
        <Box>
          <Text size="large">Sign in or create an account to start collecting patterns!</Text>
          <Box pad="medium" align="center">
            <GoogleButton onClick={handleClickSignIn} />
          </Box>
        </Box>
      </Box>
    )
}

export const SignInGoogle = compose<Props, {}>(
  withRouter,
  withFirebase,
)(GoogleAuth);
