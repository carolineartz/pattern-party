import * as React from "react"
import "styled-components/macro"

import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { useDeviceDetect } from "./../../hooks/useDeviceDetect"
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Box, Button, Text, Nav, Anchor, Heading } from "grommet"
import * as ROUTES from "./../../constants/routes"

import { ReactComponent as Logo } from "./../../images/logo-p.svg"


type WithRouterProps = {
  history: any
}

type Props = WithFirebaseProps & WithRouterProps

const SignOut = ( {firebase, history }: Props): JSX.Element => {
  const [error, setError] = React.useState<string | null>(null)
  const handleClickSignOut = () => {
    firebase.doSignOut().then(() => {
      history.push(ROUTES.LANDING)
    })
  }
    return (
      <Box fill="horizontal" direction="row" animation="slideDown">
        <Box pad="small"><Logo /></Box>
        <Box>
          <Text size="large">Sign Out!</Text>
          <Box pad="medium" align="center">
            <Button primary label="Sign Out" onClick={handleClickSignOut} />
          </Box>
        </Box>
      </Box>
    )
}

export default compose<Props, {}>(
  withRouter,
  withFirebase,
)(SignOut);
