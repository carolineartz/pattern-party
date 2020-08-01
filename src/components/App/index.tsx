import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grommet, Layer, Box } from "grommet"

import Header from "../Header"
// import PatternsPage, { CreatePattern } from "../Patterns"
import Login from "../Login"
import { withAuthentication, WithAuthProps } from '../Session';
import {withFirebase, WithFirebaseProps} from "../Firebase"
import { PatternProvider } from "./../../store"
import {usePatternSubscription, useUserPatternSubscription} from "./../../hooks/usePatternSubscription"
import CommunityPatternsPage from "./../CommunityPatterns"
import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import * as ROUTES from '../../constants/routes';

const WrappedApp = ({ authUser, firebase }: WithAuthProps & WithFirebaseProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)
  const subscribeToUserPatterns = useUserPatternSubscription(firebase)
  usePatternSubscription(firebase, "community")
  usePatternSubscription(firebase, "featured")

  React.useEffect(() => {
    subscribeToUserPatterns(authUser)
  }, [authUser])

  return (

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
              <Login />
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
          {/* { authUser && <CreatePattern showCreate={showCreate} setShowCreate={setShowCreate} /> } */}
          <Box fill margin={{top: "large"}}>
            <Route exact path={ROUTES.LANDING} component={CommunityPatternsPage} />
            <Route exact path={ROUTES.EXPLORE} component={CommunityPatternsPage} />
            {/* <Route path={ROUTES.MY_PATTERNS} component={UserPatternsPage} /> */}
          </Box>
        </Grommet>

  )
}

export const App = withFirebase(withAuthentication(({ authUser, firebase }: WithAuthProps & WithFirebaseProps) => (
  <Router>
    <PatternProvider>
      <WrappedApp firebase={firebase} authUser={authUser} />
    </PatternProvider>
  </Router>
)))

export default App
