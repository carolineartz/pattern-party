import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Layer, Box } from "grommet"
import Header from "../Header"
import PatternsPage from "./../Patterns"
import { SignInGoogle } from "./../SignIn"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CreatePattern } from "./../Patterns/create"
import Footer from "./../Footer"

import * as ROUTES from '../../constants/routes';

import { withAuthentication, WithAuthProps } from '../Session';

const App = ({ authUser }: WithAuthProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)

  return (
    <Router>
      <Grommet theme={theme}>
        <GlobalStyles />

        {!authUser && showSignIn &&
          <Layer
            responsive={false}
            full="horizontal"
            position="top"
            onEsc={() => setShowSignIn(false)}
            onClickOutside={() => setShowSignIn(false)}
          >
            <SignInGoogle />
          </Layer>
        }
        {(!showSignIn || authUser) &&
          <Layer responsive={false} full="horizontal" modal={false} position="top">
            <Header
              onClickSignIn={() => setShowSignIn(true)}
              onClickSignOut={() => {
                setShowCreate(false)
                setShowSignIn(false)
              }}
              onClickCreate={() => setShowCreate(true)}
            />
          </Layer>
        }
        { authUser && <CreatePattern showCreate={showCreate} setShowCreate={setShowCreate} /> }
        <Box fill>
          <Route exact path={ROUTES.LANDING} component={PatternsPage} />
          <Route exact path={ROUTES.EXPLORE} component={PatternsPage} />
          <Route path={ROUTES.MY_PATTERNS} component={PatternsPage} />
        </Box>
        <Footer />
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
