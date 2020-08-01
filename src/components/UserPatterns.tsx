import React from 'react';
import { compose } from 'recompose';
import { Box, Heading } from "grommet"
import compact from "lodash.compact"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthorization, WithAuthProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import { useTrackedState } from "./../store"

type UserPatternsProps = WithAuthProps & WithFirebaseProps

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const UserPatterns = (props: UserPatternsProps) => {
  console.log("UserPatterns Page", props)
  const state = useTrackedState()
  const { firebase, authUser } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)

  const patterns = compact(Array.from(state.patterns.entries()).map(([[, owner], value]) => {
   if (owner === "user") {
      return value
    }
  })).reverse()

  console.log(state.patterns)

  return (
    <Box pad="medium" className={`${authUser ? 'user' : 'explore'}-grid`}>
      <Box pad="large">
        <Heading level={1} color="text">My Patterns</Heading>
      </Box>
      <PatternGrid>
        <PatternList
          patterns={patterns}
          onDestroy={authUser ? (pattern: PatternType) => {
            setPatternForDestroy(pattern)
          } : undefined}
        />
      </PatternGrid>
      {authUser && patternForDestroy &&
        <DestroyPatternDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            firebase.userPattern(authUser.uid, patternForDestroy.id).delete()
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            firebase.userPattern(authUser.uid, patternForDestroy.id).set({hidden: true} as any, {merge: true})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
  )
}

const condition = (authUser?: firebase.User) => !!authUser;

export default compose<UserPatternsProps, any>(withAuthorization(condition), withFirebase)(UserPatterns);
