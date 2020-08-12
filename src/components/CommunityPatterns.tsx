import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { WithRouterProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog, ScrollablePatternList, Headline } from './Patterns';
import { useTrackedState, useSetDraft } from "./../store"
import { useDestroyPattern, useHidePattern, useSavePattern, usePatternSubscription, useFetchPatterns } from "./../hooks"
import * as ROUTES from "./../constants/routes"
import uniqBy from "lodash.uniqby"

type Props = WithFirebaseProps & WithRouterProps

const CommunityPatterns = ({ history, firebase }: Props): JSX.Element => {
  const authUser = firebase.authUser
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const state = useTrackedState()
  const setDraft = useSetDraft()
  const { featuredPatterns, communityPatterns, fetchPatterns: { community: { startAfter, hasMore } } } = state
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin
  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING
  const destroyPattern = useDestroyPattern({ firebase, owner: "community", user: authUser })
  const hidePattern = useHidePattern({ firebase, owner: "community", user: authUser })
  const savePattern = useSavePattern(firebase, authUser)
  const fetchPatterns = useFetchPatterns({firebase, owner: "community"})

  const loadPatterns = async (cursor: firebase.firestore.QueryDocumentSnapshot<PatternType>): Promise<LoadMoreData<PatternType>> => {
    const snapshots = await firebase.patterns().startAfter(cursor).limit(16).get()
    const docs = snapshots.docs;
    const nextLastVisible = docs[docs.length - 1];
    const noMore = nextLastVisible === cursor || docs.length < 16

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


export default React.memo(withRouter(withFirebase(CommunityPatterns)))
