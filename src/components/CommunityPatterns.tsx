import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Box } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { PatternList, PatternGrid, DestroyPatternDialog, ScrollablePatternList, Headline } from './Patterns';
import { useTrackedState } from "./../store"
import { useDestroyPattern, useHidePattern, useSavePattern, usePatternSubscription, useFetchPatterns, useLoadPatterns } from "./../hooks"
import * as ROUTES from "./../constants/routes"

const Patterns = ({ history, firebase }: WithFirebaseProps & RouteComponentProps): JSX.Element => {
  const authUser = firebase.authUser
  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING

  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin
  const { featuredPatterns, communityPatterns, fetchPatterns: { community: { startAfter, hasMore } } } = useTrackedState()
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)

  const destroyPattern = useDestroyPattern({ firebase, owner: "community", user: authUser })
  const hidePattern = useHidePattern({ firebase, owner: "community", user: authUser })
  const savePattern = useSavePattern(firebase, authUser)
  const fetchPatterns = useFetchPatterns({ firebase, owner: "community" })
  const loadPatterns = useLoadPatterns({firebase, owner: "community"})
  const subscripionStatus = usePatternSubscription(firebase)

  React.useEffect(() => {
    if (subscripionStatus === "subscribed") {
      fetchPatterns(startAfter)
    }
  }, [subscripionStatus, fetchPatterns, startAfter])

  const featuredPatternGrid = React.useMemo(() => {
    if (isFeaturedPatterns) {
      return (
        <PatternGrid>
          <PatternList
            patterns={featuredPatterns.filter(pattern => !pattern.hidden)}
            onDestroy={userIsAdmin ? (pattern: PatternType) => setPatternForDestroy(pattern) : undefined}
            onSave={authUser ? (pattern: PatternType) => savePattern(pattern.markup) : undefined}
          />
        </PatternGrid>
      )
    } else {
      return (<></>)
    }
  }, [authUser, isFeaturedPatterns, featuredPatterns, savePattern, userIsAdmin])

  return (
    <>
      <Headline collection={isFeaturedPatterns ? "featured" : "community"} />
      <Box>
        {featuredPatternGrid}
        {!isFeaturedPatterns && startAfter &&
          <PatternGrid>
            <ScrollablePatternList
              patterns={communityPatterns.filter(pattern => !pattern.hidden)}
              cursor={startAfter}
              hasMore={hasMore}
              loadMore={loadPatterns}
              onDestroy={userIsAdmin ? (pattern: PatternType) => setPatternForDestroy(pattern) : undefined}
              onSave={authUser ? (pattern: PatternType) => savePattern(pattern.markup) : undefined}
            />
          </PatternGrid>
        }
      {patternForDestroy &&
        <DestroyPatternDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            destroyPattern(patternForDestroy.id)
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            hidePattern(patternForDestroy)
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
    </>
  )
}


export const CommunityPatterns = React.memo(withRouter(withFirebase(Patterns)))
