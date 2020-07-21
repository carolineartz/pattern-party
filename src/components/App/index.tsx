import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Layer, Box } from "grommet"
import Header from "../Header"
import PatternsPage from "./../Patterns"
import { SignInGoogle } from "./../SignIn/google"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthentication, WithAuthProps } from '../Session';

const App = ({ authUser }: WithAuthProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  return (
    <Router>
      <Grommet theme={theme}>
        {!authUser && showSignIn &&
          <Layer
            full="horizontal"
            position="top"
            onEsc={() => setShowSignIn(false)}
            onClickOutside={() => setShowSignIn(false)}
          >
            <SignInGoogle />
          </Layer>
        }
        <GlobalStyles />
        <Layer full="horizontal" modal={false} position="top">
          <Header onClickSignIn={() => setShowSignIn(true)} />
        </Layer>
        <Box fill pad={{top: "xlarge"}}>
          <Route exact path={ROUTES.LANDING} component={PatternsPage} />
          <Route path={ROUTES.MY_PATTERNS} component={PatternsPage} />
        </Box>
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
