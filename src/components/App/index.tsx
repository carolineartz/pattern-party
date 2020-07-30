import React from 'react';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import { Grommet, Layer, Box } from "grommet"
import Header from "../Header"
import { SignInGoogle } from "./../SignIn"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CreatePattern } from "./../Patterns/create"
import Footer from "./../Footer"
import { useDispatch, useTrackedState } from './../../state';
import UserPatternsPage from "./../UserPatterns"
import CommunityPatternsPage from "./../CommunityPatterns"

import * as ROUTES from '../../constants/routes';

// import { withAuthentication, WithAuthProps } from '../Session';

const App = () => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)
  const state = useTrackedState();
  const dispatch = useDispatch()
  const { firebase, authUser } = state

  React.useEffect(() => {
    if (firebase) {

      dispatch({ type: "SUBSCRIBE_TO_AUTH" })

      // dispatch({ type: "FETCH_FEATURED_PATTERNS" })

      dispatch({type: "FETCH_COMMUNITY_PATTERNS"})
      dispatch({type: "SUBSCRIBE_TO_COMMUNITY_PATTERNS"})
      // dispatch({type: "SUBSCRIBE_TO_FEATURED_PATTERNS"})
    } else {
      dispatch({type: "START_APP"})
    }
  }, [firebase, dispatch])

  React.useEffect(() => {
    if (authUser) {
      dispatch({type: "FETCH_USER_PATTERNS"})
      dispatch({ type: "SUBSCRIBE_TO_USER_PATTERNS" })
    }
  }, [authUser, dispatch])


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
