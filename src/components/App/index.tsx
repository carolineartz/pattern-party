import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet } from "grommet"
import Header from "../Header"
import PatternsPage from "./../Patterns"
import { SignInGoogle } from "./../SignIn/google"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthentication, WithAuthProps } from '../Session';

const App = ({ authUser }: WithAuthProps) => {
  return (
    <Router>
      <Grommet theme={theme}>
        <GlobalStyles />
        <Header />

        <Route exact path={ROUTES.LANDING} component={PatternsPage} />
        <Route path={ROUTES.MY_PATTERNS} component={PatternsPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInGoogle} />
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
