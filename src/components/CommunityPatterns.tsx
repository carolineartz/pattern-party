import React from 'react';
import { withRouter } from 'react-router-dom';
import { firestore } from "firebase"
import { Box, Heading, Text } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthentication, WithAuthProps, WithRouterProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog, ScrollablePatternList } from './Patterns';
import * as ROUTES from "./../constants/routes"
import { useTrackedState, useSetDraft } from "./../store"
import { useCommunityPatterns } from "./../hooks/usePatterns"
import uniqBy from "lodash.uniqby"

type Props = WithAuthProps & WithFirebaseProps & WithRouterProps

const CommunityPatterns = ({history, firebase, authUser}: Props): JSX.Element => {
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const state = useTrackedState()
  const setDraft = useSetDraft()
  const { featuredPatterns, communityPatterns, fetchPatterns: { community: { startAfter, hasMore } } } = state
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin
  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING

  const loadPatterns = async (cursor: firebase.firestore.QueryDocumentSnapshot<PatternType>): Promise<LoadMoreData<PatternType>> => {
    const snapshots = await firebase.patterns().startAfter(cursor).limit(10).get()
    const docs = snapshots.docs;
    const nextLastVisible = docs[docs.length - 1];
    const noMore = nextLastVisible === cursor || docs.length < 10

    setDraft((draft) => {
      draft.fetchPatterns.community.hasMore = !noMore
      draft.fetchPatterns.community.startAfter = nextLastVisible;
      draft.communityPatterns = uniqBy([
        ...draft.communityPatterns,
        ...docs.map((doc) => doc.data()),
      ], 'id');
    });

    return [nextLastVisible, !noMore]
  }

  const fetchInitialPatterns = React.useCallback(
    async () => {
      if (!startAfter) {
        console.log("FETCHING INITIAL")
        const snapshots = await firebase.patterns().limit(10).get()
        const docs = snapshots.docs
        const nextLastVisible = docs[docs.length - 1];
        console.log("after fetching initial patterns, setting startAfer to ", nextLastVisible.id)
        setDraft((draft) => {
          draft.fetchPatterns.community.startAfter = nextLastVisible
          draft.communityPatterns = docs.map(doc => doc.data())
        })
      }
    },
    [startAfter, setDraft, firebase]
  )

  React.useEffect(() => {
    fetchInitialPatterns()
  }, [])

  return (
    <>
      <Box pad="large">
        <Heading level={1} color="text">{isFeaturedPatterns ? "Featured Patterns" : "Community Patterns"}</Heading>
        {!isFeaturedPatterns && <Text>Browse patterns by community members.</Text>}
      </Box>
      <Box>
        <PatternGrid>
          {startAfter &&
            <ScrollablePatternList
              patterns={isFeaturedPatterns ? featuredPatterns : communityPatterns}
              cursor={startAfter}
              hasMore={hasMore}
              loadMore={loadPatterns}
              onDestroy={userIsAdmin ? (pattern: PatternType) => {
                setPatternForDestroy(pattern)
              } : undefined}
              onSave={authUser ? (pattern: PatternType) => {
                if (authUser) {
                  firebase.userPatternCollection(authUser.uid).add({
                    markup: pattern.markup,
                    hidden: false,
                    createdAt: firestore.Timestamp.now()
                  })
                }
              } : undefined}
            />
          }
      </PatternGrid>
      {userIsAdmin && patternForDestroy &&
        <DestroyPatternDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            firebase.pattern(patternForDestroy.id).delete()
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            firebase.pattern(patternForDestroy.id).set({hidden: true} as any, {merge: true})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
    </>
  )
}


export default withAuthentication(withRouter(withFirebase(CommunityPatterns)))
