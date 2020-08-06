import React from 'react';
import { compose } from 'recompose';
import { Box, Heading } from "grommet"
import uniqBy from "lodash.uniqby"
import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthorization, WithAuthProps } from './Session';
import { PatternList, ScrollablePatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import { useTrackedState, useSetDraft } from "./../store"
import { useUserPatterns } from "../hooks/usePatterns"
import { Garland3 } from "./Icon"

type UserPatternsProps = WithAuthProps & WithFirebaseProps

const UserPatterns = (props: UserPatternsProps) => {
  const setDraft = useSetDraft()
  const state = useTrackedState()
  const { userPatterns, fetchPatterns: { user: { startAfter, hasMore } } } = state
  const { firebase, authUser } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)

  const loadPatterns = async (cursor: firebase.firestore.QueryDocumentSnapshot<PatternType>): Promise<LoadMoreData<PatternType>> => {
    const snapshots = await firebase.userPatterns(authUser!.uid).startAfter(cursor).limit(16).get()
    const docs = snapshots.docs;
    const nextLastVisible = docs[docs.length - 1];
    const noMore = nextLastVisible === cursor || docs.length < 16

    setDraft((draft) => {
      draft.fetchPatterns.user.hasMore = !noMore
      draft.fetchPatterns.user.startAfter = nextLastVisible;
      draft.userPatterns = uniqBy([
        ...draft.userPatterns,
        ...docs.map((doc) => doc.data()),
      ], 'id');
    });

  return [nextLastVisible, !noMore]
}

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

  return (
    <>
      <Box pad="xlarge">
        <Box direction="row" gap="small" align="center">
          <Garland3 color="plain" size="medium-large" />
          <Heading level={1} color="text">My Patterns</Heading>
        </Box>
      </Box>
      <Box>
        <PatternGrid>
          {startAfter &&
            <ScrollablePatternList
              patterns={userPatterns.filter(pattern => !pattern.hidden)}
              cursor={startAfter}
              hasMore={hasMore}
              loadMore={loadPatterns}
              onDestroy={authUser ? (pattern: PatternType) => {
                setPatternForDestroy(pattern)
              } : undefined}
            />
          }
        </PatternGrid>
        {authUser && patternForDestroy &&
          <DestroyPatternDialog
            key="destroy-dialog"
            ident={patternForDestroy.id}
            markup={patternForDestroy.markup}
            onClickDestroy={() => {
              firebase.userPattern(authUser.uid, patternForDestroy.id).delete()
              setDraft(draft => {
                draft.userPatterns = draft.userPatterns.filter(pattern => pattern.id !== patternForDestroy.id)
              })
              setPatternForDestroy(null)
            }}
            onClickHide={() => {
              const { hidden, ...restPat } = patternForDestroy
              firebase.userPattern(authUser.uid, patternForDestroy.id).set({
                hidden: true,
                ...restPat
              })
              setDraft(draft => {
                const hiddenPattern = draft.userPatterns.find(pattern => pattern.id === patternForDestroy.id)
                hiddenPattern && (hiddenPattern.hidden = true)
              })
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
