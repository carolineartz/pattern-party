import React from 'react';
import "styled-components/macro"

import { Box, Anchor } from "grommet"
import { withFirebase, WithFirebaseProps } from './Firebase';
import { ScrollablePatternList, PatternGrid, DestroyPatternDialog, Headline } from './Patterns';
import { useTrackedState } from "./../store"
import { useDestroyPattern, useHidePattern, useUnhidePattern, useFetchPatterns, useLoadPatterns } from "./../hooks"
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ROUTES from "./../constants/routes"

type UserPatternsProps = WithFirebaseProps & RouteComponentProps

const UserPatterns = (props: UserPatternsProps) => {
  const state = useTrackedState()
  const { userPatterns, fetchPatterns: { user: { startAfter, hasMore } } } = state
  const { firebase, history } = props
  const authUser = firebase.authUser
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const destroyPattern = useDestroyPattern({ firebase, owner: "user", user: authUser })
  const hidePattern = useHidePattern({ firebase, owner: "user", user: authUser })
  const unhidePattern = useUnhidePattern({ firebase, owner: "user", user: authUser })
  const fetchPatterns = useFetchPatterns({ firebase, user: authUser, owner: "user" })
  const loadPatterns = useLoadPatterns({firebase, user: authUser, owner: "user"})

  const [showHidden, setShowHidden] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!authUser) {
      history.push(ROUTES.LANDING)
    }
  }, [authUser, history])

  React.useEffect(() => {
    fetchPatterns(startAfter)
  }, [startAfter, fetchPatterns])

  return (
    <>
      <Headline
        collection="user"
        subtitle={<Anchor css="font-weight: 400" color="text" onClick={() => setShowHidden(!showHidden)} label={showHidden ? "Hide hidden" : "Show hidden"} />}
      />
      <Box>
        <PatternGrid>
          {startAfter &&
            <ScrollablePatternList
              patterns={showHidden ? userPatterns : userPatterns.filter(pattern => !pattern.hidden)}
              cursor={startAfter}
              hasMore={hasMore}
              loadMore={loadPatterns}
              onUnhide={(pattern: PatternType) => unhidePattern(pattern) }
              onDestroy={authUser ? (pattern: PatternType) => setPatternForDestroy(pattern) : undefined}
            />
          }
        </PatternGrid>
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

export default withRouter(withFirebase(UserPatterns))
