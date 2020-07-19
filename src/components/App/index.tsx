import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Box } from "grommet"
import Header from "../Header"
import ExplorePage from "./../Explore"
import HomePage from "./../Home"
import { SignInGoogle } from "./../SignIn/google"

import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <Grommet theme={theme}>
      <GlobalStyles/>
      <Header />

      <Route exact path={ROUTES.LANDING} component={ExplorePage} />
      <Route path={ROUTES.SIGN_IN} component={SignInGoogle} />
      <Route path={ROUTES.EXPLORE} component={ExplorePage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      {/* <Route path={ROUTES.ACCOUNT} component={AdminPage} /> */}
    </Grommet>
  </Router>
);

export default withAuthentication(App);


// export default () => {
//   return (
//     <Grommet theme={theme}>
//       <GlobalStyles/>
//       <Header />
//       <Box>
//         <Patterns />
//       </Box>
//     </Grommet>
//   )
// }
