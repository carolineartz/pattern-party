import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthorization, WithAuthProps } from './Session';
import { PatternList } from './PatternList';
import { PatternGrid } from "./Patterns/grid"
import { DestroyDialog } from "./Patterns/destroy"
import {PatternCollectionState} from "./Patterns/context"
import { ScrollablePatternList } from './ScrollablePatternList';
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

const CommunityPatterns = React.memo((props: CommunityPatternProps) => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const { authUser, patterns } = state
  const isFeaturedPatterns = props.location.pathname === ROUTES.LANDING
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const user = authUser as any
  const userIsAdmin = user && user.roles && user.roles.admin

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
            onSave={authUser ? (pattern: PatternType) => {
              dispatch({type: 'CREATE_PATTERN', markup: pattern.markup})
            } : undefined}
            />
          </PatternGrid>
        </Box>}
      {userIsAdmin && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            dispatch({type: "DELETE_PATTERN", id: [patternForDestroy.id, "community"]})
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            dispatch({type: "HIDE_PATTERN", id: [patternForDestroy.id, "community"]})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </>
  )
})

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
