import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Layer, Box } from "grommet"
import Header from "../Header"
import { SignInGoogle } from "./../SignIn"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CreatePattern } from "./../Patterns/create"
import Footer from "./../Footer"
import { useTrackedState } from './../../state';
import UserPatternsPage from "./../UserPatterns"
import CommunityPatternsPage from "./../CommunityPatterns"

import * as ROUTES from '../../constants/routes';

// import { withAuthentication, WithAuthProps } from '../Session';

const App = () => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)
  const state = useTrackedState();

  return (
    <Router>
      <Grommet theme={theme}>
        <GlobalStyles />

        {!state.authUser && showSignIn &&
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
        {(!showSignIn || state.authUser) &&
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
        { state.authUser && <CreatePattern showCreate={showCreate} setShowCreate={setShowCreate} /> }
        <Box fill>
          <Route exact path={ROUTES.LANDING} component={CommunityPatternsPage} />
          <Route exact path={ROUTES.EXPLORE} component={CommunityPatternsPage} />
          <Route path={ROUTES.MY_PATTERNS} component={UserPatternsPage} />
        </Box>
        <Footer />
      </Grommet>
    </Router>
  )
}

export default App
