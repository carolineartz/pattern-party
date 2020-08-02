import React from 'react';
import { withRouter } from 'react-router-dom';
import { firestore } from "firebase"
import { Box, Heading, Text } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthentication, WithAuthProps, WithRouterProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import * as ROUTES from "./../constants/routes"
import { useTrackedState, useSetDraft } from "./../store"
type Props = WithAuthProps & WithFirebaseProps & WithRouterProps

const CommunityPatterns = ({history, firebase, authUser}: Props): JSX.Element => {
  const [ patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const { featuredPatterns, communityPatterns } = useTrackedState();
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin

  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING
  const setDraft = useSetDraft()
  const state = useTrackedState()
  const { fetchPatterns: { community: { startAfter, hasMore } } } = state

  const fetchInitialPatterns = async () => {
    const snapshots = await firebase.patterns().get()
    const docs = snapshots.docs
    const lastVisible = docs[docs.length - 1];

    setDraft((draft) => {
      draft.fetchPatterns.community.startAfter = lastVisible
      draft.communityPatterns = docs.map(doc => doc.data())
    })
  }

  React.useEffect(() => {
    if (!startAfter) {
      fetchInitialPatterns()
    }
  }, [startAfter])

  return (
    <>
    <Box pad="large">
      <Heading level={1} color="text">{isFeaturedPatterns ? "Featured Patterns" : "Community Patterns"}</Heading>
      {!isFeaturedPatterns && <Text>Browse patterns by community members.</Text>}
      </Box>
      <Box>
      <PatternGrid>
        <PatternList
          patterns={isFeaturedPatterns ? featuredPatterns : communityPatterns}
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


export default React.memo(withAuthentication(withRouter(withFirebase(CommunityPatterns))))
