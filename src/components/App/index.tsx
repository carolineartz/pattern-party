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
import { usePatternSubscription, useUserPatternSubscription } from "./../../hooks/usePatternSubscription"
import { useUserPatterns } from "../../hooks/usePatterns"
import CommunityPatternsPage from "./../CommunityPatterns"
import UserPatternsPage from "./../UserPatterns"
import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import * as ROUTES from '../../constants/routes';
import { useSetDraft, useTrackedState } from './../../store';

const WrappedApp = React.memo(({ authUser, firebase }: WithAuthProps & WithFirebaseProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)

  const setDraft = useSetDraft();

  // React.useEffect(() => {
  //   let featuredUnsubscribe: firebase.Unsubscribe
  //   let communityUnsubscribe: firebase.Unsubscribe

  //   communityUnsubscribe = firebase.patterns().onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       if (change.type === "added") {
  //         setDraft(draft => {
  //           // debugger
  //           // draft.communityPatterns.push(change.doc.data())
  //           draft.communityPatterns = [change.doc.data(), ...draft.communityPatterns]
  //         })
  //       }
  //     })
  //   })

  //   featuredUnsubscribe = firebase.featuredPatterns().onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       if (change.type === "added") {
  //         setDraft(draft => {
  //           draft.featuredPatterns = [change.doc.data(), ...draft.featuredPatterns]
  //         })
  //       } else if (change.type === "removed") {
  //         setDraft(draft => {
  //           draft.featuredPatterns = draft.featuredPatterns.filter(pat => pat.id !== change.doc.id)
  //         })
  //       }
  //     })
  //   })

  //   return () => {
  //     if (featuredUnsubscribe) {
  //       featuredUnsubscribe()
  //     }
  //     if (communityUnsubscribe) {
  //       communityUnsubscribe()
  //     }
  //   }
  // }, [])

  const subscripionStatus = usePatternSubscription(firebase)

  return (
    <Grommet theme={theme}>
      <GlobalStyles />
      <Box fill>
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
        {subscripionStatus === "subscribed" && <Box fill margin={{ top: "large" }}>
          <Route exact path={ROUTES.LANDING} component={CommunityPatternsPage} />
          <Route exact path={ROUTES.EXPLORE} component={CommunityPatternsPage} />
          <Route path={ROUTES.MY_PATTERNS} component={UserPatternsPage} />
        </Box>
        }
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
