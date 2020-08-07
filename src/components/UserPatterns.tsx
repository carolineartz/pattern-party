import React from 'react';
import "styled-components/macro"

import { Box, Heading, Button, Anchor } from "grommet"
import uniqBy from "lodash.uniqby"
import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthorization, WithAuthProps } from './Session';
import { ScrollablePatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import { useTrackedState, useSetDraft } from "./../store"
import { useDestroyPattern } from "./../hooks/useDestroyPattern"
import { useHidePattern } from "./../hooks/useHidePattern"
import { useUnhidePattern} from "./../hooks/useUnhidePattern"
import { randomIcon } from "./Icon"

type UserPatternsProps = WithAuthProps & WithFirebaseProps

const UserPatterns = (props: UserPatternsProps) => {
  const setDraft = useSetDraft()
  const state = useTrackedState()
  const { userPatterns, fetchPatterns: { user: { startAfter, hasMore } } } = state
  const { firebase, authUser } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const destroyPattern = useDestroyPattern({ firebase, owner: "user", user: authUser })
  const hidePattern = useHidePattern({ firebase, owner: "user", user: authUser })
  const unhidePattern = useUnhidePattern({ firebase, owner: "user", user: authUser })

  const [showHidden, setShowHidden] = React.useState<boolean>(false)

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

  const fetchInitialPatterns = React.useCallback(async (usr: firebase.User) => {
    const snapshots = await firebase.userPatterns(usr.uid).get()
    const docs = snapshots.docs
    const lastVisible = docs[docs.length - 1];

    setDraft((draft) => {
      draft.fetchPatterns.user.startAfter = lastVisible
      draft.userPatterns = docs.map(doc => doc.data())
    })
  }, [firebase, setDraft])

  React.useEffect(() => {
    if (!startAfter && authUser) {
      fetchInitialPatterns(authUser)
    }
  }, [startAfter, authUser, fetchInitialPatterns])

  const headingIcon = React.useMemo(() => {
    const Icon = randomIcon()!
    return <Icon color="plain" size="xlarge" />
  }, [])


  return (
    <>
      <Box pad="xlarge">
        <Box direction="row" gap="medium" align="center">
          {headingIcon}
          <Box>
            <Heading size="large" level={1} color="text">My Patterns</Heading>
            <Anchor css="font-weight: 400" color="text" onClick={() => setShowHidden(!showHidden)} label={showHidden ? "Hide hidden" : "Show hidden"} />
          </Box>
        </Box>
      </Box>
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

const condition = (authUser?: firebase.User) => !!authUser;

export default React.memo(withAuthorization(condition)((withFirebase(UserPatterns))))
