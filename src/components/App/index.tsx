import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grommet, Layer, Box } from "grommet"
import "styled-components/macro"

import Header from "../Header"
import Login from "../Login"
import { CreateWindow } from "../Patterns"
import Footer from "./../Footer"
import { withAuthentication, WithAuthProps } from '../Session';
import {withFirebase, WithFirebaseProps} from "../Firebase"
import { PatternProvider } from "./../../store"
import { usePatternSubscription } from "./../../hooks/usePatternSubscription"
import { useLocalStorage } from "./../../hooks/useLocalStorage"
import CommunityPatternsPage from "./../CommunityPatterns"
import UserPatternsPage from "./../UserPatterns"
import { PublicInfoPanel, UserInfoPanel } from "../InfoPanel"
import { theme } from "./theme"
import { Garland3 } from "./../Icon"
import { GlobalStyles } from './globalStyles';
import * as ROUTES from '../../constants/routes';
import { Loader } from "./../Loader"

const WrappedApp = React.memo(({ authUser, firebase }: WithAuthProps & WithFirebaseProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)
  const [showPublicInfoPanel, setShowPublicInfoPanel] = useLocalStorage<boolean>("pp-show-info", true)
  const [showUserInfoPanel, setShowUserInfoPanel] = useLocalStorage<boolean>("pp-show-intro", true)

  const subscripionStatus = usePatternSubscription(firebase)

  return (
    <Grommet css="min-height: 100vh" theme={theme}>
      <GlobalStyles />
      <Box fill>
        {!authUser && showSignIn &&
          <Layer
            responsive={false}
            full="horizontal"
            position="top"
            onEsc={() => setShowSignIn(false)}
            onClickOutside={() => setShowSignIn(false)}
            css="border-radius: 0"
          >
            <Login />
          </Layer>
        }
        {((!showSignIn || authUser) && subscripionStatus === "subscribed") &&
          <Layer responsive={false} full="horizontal" modal={false} position="top">
            <Header
              onClickSignIn={() => setShowSignIn(true)}
              onClickSignOut={() => {
                setShowCreate(false)
                setShowSignIn(false)
              }}
              onClickCreate={() => setShowCreate(true)}
              onClickShowIntro={() => setShowUserInfoPanel(true)}
            />
          </Layer>
        }
          <Box fill css="min-height: 90vh" margin={{ vertical: "large" }}>
          {!authUser && showPublicInfoPanel &&
            <Box pad={{ top: "xlarge", horizontal: "large" }}>
              <PublicInfoPanel onClickSignIn={() => setShowSignIn(true)} onDismiss={() => setShowPublicInfoPanel(false)} />
            </Box>
          }
          {authUser && showUserInfoPanel &&
            <Box pad={{ top: "xlarge", horizontal: "large" }}>
              <UserInfoPanel onDismiss={() => setShowUserInfoPanel(false)} />
            </Box>
          }
          {subscripionStatus !== "subscribed" &&  <Box fill align="center" justify="center" id="loader" css="min-height: 90vh"><Loader /></Box> }
          {subscripionStatus === "subscribed" &&
            <>
              <Route exact path={ROUTES.LANDING} component={CommunityPatternsPage} />
              <Route exact path={ROUTES.EXPLORE} component={CommunityPatternsPage} />
              <Route path={ROUTES.MY_PATTERNS} component={UserPatternsPage} />
            </>
          }
          <Box fill="horizontal" align="center" justify="center"><Garland3 size="xxxlarge" color="plain" /></Box>
        </Box>
        <Footer />
          <Layer responsive={false} animate={false} position="top-left" modal={false}>
            {authUser &&
              <CreateWindow showWindow={showCreate} setShowWindow={setShowCreate} />
            }
          </Layer>
      </Box>
    </Grommet>
  )
})

export const App = withFirebase(withAuthentication(({ authUser, firebase }: WithAuthProps & WithFirebaseProps) => (
  <Router>
    <PatternProvider>
      <WrappedApp firebase={firebase} authUser={authUser} />
    </PatternProvider>
  </Router>
)))

export default App
