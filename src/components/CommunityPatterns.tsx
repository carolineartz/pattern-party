import React from 'react';

import { PatternList } from './PatternList';
import { PatternGrid } from "./Patterns/grid"
import { DestroyDialog } from "./Patterns/destroy"
import { Box, Heading, Text } from "grommet"
import "styled-components/macro"
import * as ROUTES from '../constants/routes';

import { useDispatch, useTrackedState } from './../state';

import {communityPatterns, featuredPatterns} from "./../util"
// type UserPatternsProps = WithAuthProps & WithFirebaseProps & {
//   patterns: PatternType[]
//   startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
//   setHasMoreUserPatterns: (hasMore: boolean) => void
//   setUserPatterns: (data: PatternTypeResponse) => void
//   fetchUserPatterns: (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>) => Promise<PatternTypeResponse>
//   hasMoreUserPatterns: boolean
// }

// type LoadingState = "not-started" | "loading" | "loaded" | "error"

type CommunityPatternProps = {
  location: any
}

const CommunityPatterns = (props: CommunityPatternProps) => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const { authUser, patterns, loading } = state
  const [ready, setReady] = React.useState<boolean>(false)
  const isFeaturedPatterns = props.location.pathname === ROUTES.LANDING
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const user = authUser as any
  const userIsAdmin = user && user.roles && user.roles.admin

  React.useEffect(() => {
    if (authUser) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [authUser, setReady])

  return (
    <>
      <ExploreText key="text-explore-patterns" />
      {communityPatterns(patterns).length &&
        <Box pad={{horizontal: "medium", bottom: "medium"}} width={{max: "1080px"}} margin="auto" css='width: 100%'>
          <PatternGrid>
            <PatternList
            patterns={isFeaturedPatterns ? featuredPatterns(patterns) : communityPatterns(patterns)}
            onDestroy={userIsAdmin ? (pattern: PatternType) => {
              setPatternForDestroy(pattern)
            } : undefined}
            onSave={authUser && ready ? (pattern: PatternType) => {
              dispatch({ type: 'CREATE_PATTERN', markup: pattern.markup, owner: "community" })
              debugger
            } : undefined}
            />
        </PatternGrid>
        {loading && <Box>loadig!</Box>}
        </Box>}
      {userIsAdmin && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            setPatternForDestroy(null)
            dispatch({type: "DELETE_PATTERN", id: [patternForDestroy.id, "community"]})
          }}
          onClickHide={() => {
            setPatternForDestroy(null)
            dispatch({type: "HIDE_PATTERN", id: [patternForDestroy.id, "community"]})
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </>
  )
}

const ExploreText = () => (
  <TextBlock text="Explore Patterns">
    <Text>Browse patterns by community members.</Text>
  </TextBlock>
)

const TextBlock = ({ text, children }: { text: string, children?: React.ReactNode }) => (
  <Box pad="large">
    <Heading level={1} color="text">{text}</Heading>
    {children}
  </Box>
)

// const condition = (authUser?: firebase.User) => !!authUser;

// withFirebase(export default compose<CommunityPatternsProps, any>(withAuthorization(condition), withFirebase)(CommunityPatterns);

export default CommunityPatterns
