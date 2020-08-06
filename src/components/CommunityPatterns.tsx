import React from 'react';
import { withRouter } from 'react-router-dom';
import { firestore } from "firebase"
import { Box, Heading, Text } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthentication, WithAuthProps, WithRouterProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog, ScrollablePatternList } from './Patterns';
import * as ROUTES from "./../constants/routes"
import { useTrackedState, useSetDraft } from "./../store"
import { useDestroyPattern } from "./../hooks/useDestroyPattern"
import { useHidePattern } from "./../hooks/useHidePattern"
import { useSavePattern } from "./../hooks/useSavePattern"
import uniqBy from "lodash.uniqby"
import { randomIcon } from "./Icon"
import { usePatternSubscription } from "./../hooks/usePatternSubscription"
type Props = WithAuthProps & WithFirebaseProps & WithRouterProps

const CommunityPatterns = ({history, firebase, authUser}: Props): JSX.Element => {
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const state = useTrackedState()
  const setDraft = useSetDraft()
  const { featuredPatterns, communityPatterns, fetchPatterns: { community: { startAfter, hasMore } } } = state
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin
  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING
  const destroyPattern = useDestroyPattern({ firebase, owner: "community", user: authUser })
  const hidePattern = useHidePattern({ firebase, owner: "community", user: authUser })
  const savePattern = useSavePattern(firebase, authUser)

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

  const fetchInitialPatterns = React.useCallback(
    async () => {
      if (!startAfter) {
        const communitySnapshots = await firebase.patterns(16).get()
        const featuredPatterns = await firebase.featuredPatterns().get()
        const docs = communitySnapshots.docs
        const nextLastVisible = docs[docs.length - 1];
        setDraft((draft) => {
          draft.fetchPatterns.community.startAfter = nextLastVisible
          draft.communityPatterns = docs.map(doc => doc.data())
          draft.featuredPatterns = featuredPatterns.docs.map(doc => doc.data())
        })
      }
    },
    [startAfter, setDraft, firebase]
  )

  const subscripionStatus = usePatternSubscription(firebase)

  React.useEffect(() => {
    if (subscripionStatus === "subscribed") {
      fetchInitialPatterns()
    }
  }, [subscripionStatus, fetchInitialPatterns])

  // const signedOutMessage = <Text>Sign in with Google to bookmark community patterns and collect your own creations!</Text>
  const CommunityIcon = randomIcon()!
  const FeaturedIcon = randomIcon()!

  const header = React.useMemo(() => {
    if (isFeaturedPatterns) {
      return (
        <Box pad="xlarge">
          <Box direction="row" gap="medium" align="center">
            <FeaturedIcon color="plain" size="xlarge" />
            <Box>
              <Heading size="large" level={1} color="text">Featured Patterns</Heading>
              <Text>A selection of awesome patterns by community members.</Text>
            </Box>
          </Box>
        </Box>
      )
    } else {
      return (
        <Box pad="xlarge">
          <Box direction="row" gap="medium" align="center">
            <CommunityIcon color="plain" size="xlarge" />
            <Box>
              <Heading size="large" level={1} color="text">Community Patterns</Heading>
              <Text>Browse patterns by community members.</Text>
            </Box>
          </Box>
        </Box>
      )
    }
  }, [isFeaturedPatterns])

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
      {header}
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
            hidePattern(patternForDestroy.id)
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
    </>
  )
}


export default React.memo(withAuthentication(withRouter(withFirebase(CommunityPatterns))))
