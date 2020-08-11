import React from 'react';
import "styled-components/macro"
import { GlobalStyles } from './globalStyles';

import { BrowserRouter as Router, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { Grommet, Layer, Box } from "grommet"
import { theme } from "./theme"

import {AuthHeader, PublicHeader} from "../Header"
import Footer from "./../Footer"
import Login from "../Login"
import CommunityPatternsPage from "./../CommunityPatterns"
import UserPatternsPage from "./../UserPatterns"

import { CreateWindow } from "../Patterns"
import { withFirebase, WithFirebaseProps } from "../Firebase"
import { PatternProvider } from "./../../store"
import { usePatternSubscription, useLocalStorage, useFirebaseUser } from "./../../hooks"
import { PublicInfoPanel, UserInfoPanel } from "../InfoPanel"
import { Garland3 } from "./../Icon"
import { Loader } from "./../Loader"
import firebase from "./../Firebase"

const AUTH_QUERY = "?mode=select"

type Props = RouteComponentProps & {
  firebase: firebase
  authUser?: firebase.User
}

const Main = ({ firebase, history }: Props): JSX.Element => {
  const query = history.location.search
  const getUser = useFirebaseUser({ firebase })
  const [showSignIn, setShowSignIn] = React.useState<boolean>(query === AUTH_QUERY)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)
  const [showPublicInfoPanel, setShowPublicInfoPanel] = useLocalStorage<boolean>("pp-show-info", true)
  const [showUserInfoPanel, setShowUserInfoPanel] = useLocalStorage<boolean>("pp-show-intro", true)
  const [authUser, setAuthUser] = React.useState<firebase.User | undefined>(undefined)

  const subscripionStatus = usePatternSubscription(firebase)
  const isSubscribed = subscripionStatus === "subscribed"

  const header = React.useMemo(() => {
    if (!isSubscribed) { return }

    if (authUser) {
      return (
        <AuthHeader
          authUser={authUser}
          onClickSignOut={() => {
            setShowCreate(false)
            setShowSignIn(false)
            setAuthUser(undefined)
          }}
          onClickCreate={() => setShowCreate(true)}
          onClickShowIntro={() => setShowUserInfoPanel(true)}
        />
      )
    } else if (showSignIn) {
      return <Login onDismiss={() => setShowSignIn(false)} />
    } else {
      return <PublicHeader onClickSignIn={() => setShowSignIn(true)} />
    }
  }, [authUser, showSignIn, isSubscribed, setShowUserInfoPanel, setShowSignIn])


  const infoPanel = React.useMemo(() => {
    if (!(showPublicInfoPanel || showUserInfoPanel)) { return }

    const content = showPublicInfoPanel ?
      <PublicInfoPanel onClickSignIn={() => setShowSignIn(true)} onDismiss={() => setShowPublicInfoPanel(false)} /> :
      <UserInfoPanel onDismiss={() => setShowUserInfoPanel(false)} />

    return (
      <Box pad={{ top: "xlarge", horizontal: "large" }}>
        {content}
      </Box>
    )

  }, [showPublicInfoPanel, showUserInfoPanel, setShowUserInfoPanel, setShowSignIn, setShowPublicInfoPanel])

  const createPane = React.useMemo(() => {
    if (!authUser) { return }

    return (
      <Layer responsive={false} animate={false} position="top-left" modal={false}>
        <CreateWindow showWindow={showCreate} setShowWindow={setShowCreate} />
      </Layer>
    )
  }, [authUser, showCreate])

  React.useEffect(() => {
    const unsubscribe = firebase.auth.onIdTokenChanged((maybeAuthUser: firebase.User | null) => {
      if (maybeAuthUser) {
        getUser(maybeAuthUser).then(user => {
          setAuthUser(user)
        })
      }
    })
    return (() => {
      unsubscribe()
    })
  }, [getUser, setAuthUser, firebase.auth])


  return (
    <Grommet css="min-height: 100vh" theme={theme}>
      <GlobalStyles />
      <Box fill>
        {header}
        <Box fill css="min-height: 90vh" margin={{ vertical: "large" }}>
          {infoPanel}
          {subscripionStatus !== "subscribed" ?
            <Box fill align="center" justify="center" id="loader" css="min-height: 90vh">
              <Loader />
            </Box> :
            <>
              <Route exact path={ROUTES.LANDING} component={CommunityPatternsPage} />
              <Route exact path={ROUTES.EXPLORE} component={CommunityPatternsPage} />
              <Route path={ROUTES.MY_PATTERNS} component={UserPatternsPage} />
              <Box fill="horizontal" align="center" justify="center">
                <Garland3 size="xxxlarge" color="plain" />
              </Box>
            </>}
        </Box>
        <Footer />
        {createPane}
      </Box>
    </Grommet>
  )
}

const WrappedApp = withRouter(Main)

export const App = withFirebase(({ firebase }: WithFirebaseProps) => (
  <Router>
    <PatternProvider>
      <WrappedApp firebase={firebase} />
    </PatternProvider>
  </Router>
))

export default App
