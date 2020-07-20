import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Layer } from "grommet"
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
        {showSignIn &&
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
        <Header onClickSignIn={() => setShowSignIn(true)} />
        <Route exact path={ROUTES.LANDING} component={PatternsPage} />
        <Route path={ROUTES.MY_PATTERNS} component={PatternsPage} />
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
