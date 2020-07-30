import * as React from "react"
import "styled-components/macro"

import { withRouter } from 'react-router-dom';
import { Box, Text } from "grommet"
import GoogleButton from 'react-google-button'
import { ReactComponent as Logo } from "./../images/logo-with-text-white-outline.svg"
import { useDispatch, useTrackedState } from './../state';


type SignInGoogleProps = {
  history: any
}

export const SignIn = ( { history }: SignInGoogleProps): JSX.Element => {
  // const [error, setError] = React.useState<string | null>(null)
  const dispatch = useDispatch();

  const handleClickSignIn = () => {
    dispatch({type: "LOGIN_USER"})
  }
    return (
      <Box fill="horizontal" pad="large" animation="slideDown" justify="center" align="center">
        <Box direction="row" align="center" justify="center">
          <Box pad="small"><Logo /></Box>
          <Text size="large">Sign in or create an account to start collecting patterns!</Text>
        </Box>
        <Box pad="medium" align="center">
          <GoogleButton onClick={handleClickSignIn} />
        </Box>
      </Box>
    )
}

export const SignInGoogle = withRouter(SignIn)
