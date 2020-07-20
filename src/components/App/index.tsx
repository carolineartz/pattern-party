import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Box } from "grommet"
import Header from "../Header"
import ExplorePage from "./../Explore"
import LandingPage from "./../Landing"
import { SignInGoogle } from "./../SignIn/google"
import SignOut from "./../SignOut"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthentication, WithAuthProps } from '../Session';

const App = ({ authUser }: WithAuthProps) => {
  console.log("authUser - App", authUser)
  return (
    <Router>
      <Grommet theme={theme}>
        <GlobalStyles />
        <Header />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInGoogle} />
        <Route path={ROUTES.SIGN_OUT} component={SignOut} />
        <Route path={ROUTES.EXPLORE} component={ExplorePage} />

        {/* <Route path={ROUTES.ACCOUNT} component={AdminPage} /> */}
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
