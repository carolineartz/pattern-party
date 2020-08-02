import React from 'react';
import { compose } from 'recompose';
import { Box, Heading } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthorization, WithAuthProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import { useTrackedState, useSetDraft } from "./../store"
import { useUserPatterns } from "../hooks/usePatterns"

type UserPatternsProps = WithAuthProps & WithFirebaseProps

const UserPatterns = (props: UserPatternsProps) => {
  console.log("UserPatterns Page", props)
  const setDraft = useSetDraft()
  const state = useTrackedState()
  const { userPatterns, fetchPatterns: { user: { startAfter, hasMore } } } = state
  const { firebase, authUser } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)

  const fetchInitialPatterns = async (usr: firebase.User) => {
    const snapshots = await firebase.userPatterns(usr.uid).get()
    const docs = snapshots.docs
    const lastVisible = docs[docs.length - 1];

    setDraft((draft) => {
      draft.fetchPatterns.user.startAfter = lastVisible
      draft.userPatterns = docs.map(doc => doc.data())
    })
  }

  React.useEffect(() => {
    if (!startAfter && authUser) {
      fetchInitialPatterns(authUser)
    }
  }, [startAfter, authUser])

  console.log("state", state)

  return (
    <>
      <Box pad="large">
        <Heading level={1} color="text">My Patterns</Heading>
      </Box>
      <Box>
        <PatternGrid>
          <PatternList
            patterns={userPatterns}
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
    </>
  )
}

const condition = (authUser?: firebase.User) => !!authUser;

export default React.memo(withAuthorization(condition)((withFirebase(UserPatterns))))
