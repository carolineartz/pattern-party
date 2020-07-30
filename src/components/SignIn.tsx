import * as React from "react"
import "styled-components/macro"

import { withRouter } from 'react-router-dom';
import { Box, Text } from "grommet"
import GoogleButton from 'react-google-button'
import { ReactComponent as Logo } from "./../images/logo-with-text-white-outline.svg"
import { useDispatch } from './../state';

export const SignIn = (): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <Box fill="horizontal" pad="large" animation="slideDown" justify="center" align="center">
      <Box direction="row" align="center" justify="center">
        <Box pad="small"><Logo /></Box>
        <Text size="large">Sign in or create an account to start collecting patterns!</Text>
      </Box>
      <Box pad="medium" align="center">
        <GoogleButton onClick={() => dispatch({type: "LOGIN_USER"})} />
      </Box>
    </Box>
  )
}

export const SignInGoogle = withRouter(SignIn)
