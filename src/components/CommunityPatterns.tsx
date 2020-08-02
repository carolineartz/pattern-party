import React from 'react';
import { withRouter } from 'react-router-dom';
import { firestore } from "firebase"
import { Box, Heading, Text } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthentication, WithAuthProps, WithRouterProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog } from './Patterns';
import { ScrollablePatternList } from "./ScrollablePatternList"
import * as ROUTES from "./../constants/routes"
import { useTrackedState, useSetDraft } from "./../store"
import { useCommunityPatterns } from "./../hooks/usePatterns"
import uniqBy from "lodash.uniqby"

type Props = WithAuthProps & WithFirebaseProps & WithRouterProps

const CommunityPatterns = ({history, firebase, authUser}: Props): JSX.Element => {
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const state = useTrackedState()
  const { featuredPatterns, communityPatterns, fetchPatterns: { community, community: { startAfter, hasMore } } } = state
  const setDraft = useSetDraft()
  // const { featuredPatterns, communityPatterns } = useTrackedState();
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin
  const [lastVisible, setLastVisible] = React.useState<typeof startAfter>(startAfter)
  const isFeaturedPatterns = history.location.pathname === ROUTES.LANDING

  React.useEffect(() => {
    setLastVisible(startAfter)
  }, [startAfter])

  // const [lastVisible, setLastVisible] = React.useState<typeof startAfter>(startAfter)

  // const { fetchPatterns: { community: { startAfter, hasMore } } } = state
  // const loadPatterns = useCommunityPatterns(firebase)


    // const loadPatterns = async (hm: typeof hasMore, lv?: typeof lastVisible, ) => {
    //   if (hm && lv) {
    //     console.log("lastVisible", lv && lv.id)
    //     const snapshots = await firebase.patterns().startAfter(lv).limit(10).get()
    //     const docs = snapshots.docs
    //     const nextLastVisible = docs[docs.length - 1];
    //     setLastVisible(nextLastVisible)

    //     setDraft((draft) => {
    //       draft.fetchPatterns.community.hasMore = !(lv === nextLastVisible || docs.length < 10)
    //       draft.fetchPatterns.community.startAfter = nextLastVisible
    //       draft.communityPatterns = uniqBy([...draft.communityPatterns, ...docs.map(doc => doc.data())], "id")
    //     })
    //   } else {
    //     console.log("NO MORE!")
    //   }
    // }
  const loadPatterns = async (sa: any) => {
    console.log("Calling loadPatterns with lastVisible", sa.id);

    const snapshots = await firebase.patterns().startAfter(sa).limit(10).get()
    const docs = snapshots.docs;
    const nextLastVisible = docs[docs.length - 1];

    // setLastVisible(nextLastVisible);

    setDraft((draft) => {
      draft.fetchPatterns.community.startAfter = nextLastVisible;
      draft.communityPatterns = uniqBy([
        ...draft.communityPatterns,
        ...docs.map((doc) => doc.data()),
      ], 'id');
    });

    return nextLastVisible

  }
    // }, [startAfter])

    // const loadPatterns = React.useCallback((hm: typeof hasMore, lv: typeof startAfter) => async (lastViz: Required<typeof community>["startAfter"]) => {
    // const loadPatterns = async (lastViz: Required<typeof community>["startAfter"]) => {
    //   // if (hm && lv) {
    //     console.log("Calling loadPatterns with lastVisible", lastViz.id);

    //     const snapshots = await firebase.patterns().startAfter(lastViz).limit(10).get()
    //     const docs = snapshots.docs;
    //     const nextLastVisible = docs[docs.length - 1];

    //     // setLastVisible(nextLastVisible);

    //     setDraft((draft) => {
    //       draft.fetchPatterns.community.startAfter = nextLastVisible;
    //       draft.communityPatterns = uniqBy([
    //         ...draft.communityPatterns,
    //         ...docs.map((doc) => doc.data()),
    //       ], 'id');
    //     });
    // }
      //  else {
      //   console.log("NO MORE!");
      // }
    // },
  //   [state.fetchPatterns.community.startAfter, setDraft, firebase]
  // );

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
        // setLastVisible(nextLastVisible)
      }
    },
    [startAfter, setDraft, firebase]
  )

  React.useEffect(() => {
    fetchInitialPatterns()
  }, [])

  console.group()
  console.log("rendering CommunityPatterns WITH: startAfter", startAfter && startAfter.id)
  console.log("rendering CommunityPatterns WITH: lastVisible", lastVisible && lastVisible.id)
  console.groupEnd()

  // const fn = loadPatterns(startAfter)
  return (
    <>
    <Box pad="large">
      <Heading level={1} color="text">{isFeaturedPatterns ? "Featured Patterns" : "Community Patterns"}</Heading>
      {!isFeaturedPatterns && <Text>Browse patterns by community members.</Text>}
      </Box>
      <Box>
        <PatternGrid>
        {/* <PatternList
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
      </PatternGrid> */}
            {/* cursor={state.fetchPatterns.community.startAfter}
            hasMore={true} */}
          {lastVisible && startAfter &&
            <ScrollablePatternList
            patterns={isFeaturedPatterns ? featuredPatterns : communityPatterns}
              cursor={startAfter}
              loadMore={(foo: any) => loadPatterns(foo)}
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
