import React from 'react';
import { compose } from 'recompose';
import { withPatterns, WithPatternsProps } from "./../Patterns/context"
import { withAuthentication, WithAuthProps } from '../Session';
import { firestore } from "firebase"
import "styled-components/macro"
import UserPatterns from "../UserPatterns"
import { Box, Text, Heading } from "grommet"
import * as ROUTES from '../../constants/routes';
import { DestroyDialog } from "./destroy"
import { PatternGrid } from "./../Patterns/grid"
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { PatternList } from './../PatternList';

import "styled-components/macro"
import { ScrollablePatternList } from '../ScrollablePatternList';

type PatternsPageProps = WithFirebaseProps & WithAuthProps & WithPatternsProps & { location: any }

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const PatternsPage = React.memo((props: PatternsPageProps) => {
  console.log("Patterns Page", props)
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)

  const { community: communityPatterns, user: userPatterns, fetchPatterns } = props
  const featuredPatterns = communityPatterns.patterns.filter((pData: PatternData) => Boolean(pData.featured))

  const isFeaturedPatterns = props.location.pathname === ROUTES.LANDING
  const isUserPatterns = props.location.pathname === ROUTES.MY_PATTERNS
  const user = props.authUser as any
  const userIsAdmin = user && user.roles && user.roles.admin

  if (isUserPatterns) {
    return <UserPatterns key="patterns-user" patternCollection={userPatterns} />
  } else {
    return (
      <>
        { isFeaturedPatterns ? <FeaturedText key="text-featured" /> : <ExploreText key="text-explore" /> }
         <Box pad={{horizontal: "medium", bottom: "medium"}} width={{max: "1080px"}} margin="auto" css='width: 100%'>
          <PatternGrid
            colMinWidth={isFeaturedPatterns ? '380px' : undefined}
            rowMinHeight={isFeaturedPatterns ? '300px' : undefined}
            rowMaxHeight={isFeaturedPatterns ? '33vh' : undefined}
          >
            <ScrollablePatternList
              patterns={isFeaturedPatterns ? featuredPatterns : communityPatterns.patterns}
              onDestroy={userIsAdmin ? (pattern: PatternData) => {
                setPatternForDestroy(pattern)
              } : undefined}
              onSave={props.authUser ? (pattern: PatternData) => {
                if (props.authUser) {
                  props.firebase.userPatternCollection(props.authUser.uid).add({
                    markup: pattern.markup,
                    hidden: false,
                    createdAt: firestore.Timestamp.now()
                  })
                }
              } : undefined}
              fetch={fetchPatterns.bind(null, undefined, communityPatterns.startAfter)}
              more={communityPatterns.more}
            />
          </PatternGrid>
         </Box>
        { !isUserPatterns && userIsAdmin && patternForDestroy &&
          <DestroyDialog
            key="destroy-dialog"
            ident={patternForDestroy.id}
            markup={patternForDestroy.markup}
            onClickDestroy={() => {
              props.firebase.pattern(patternForDestroy.id).delete()
              setPatternForDestroy(null)
            }}
            onClickHide={() => {
              props.firebase.pattern(patternForDestroy.id).set({hidden: true}, {merge: true})
              setPatternForDestroy(null)
            }}
            closeDialog={() => setPatternForDestroy(null)}
          />}
      </>
    )
  }
})

const TextBlock = ({ text, children }: { text: string, children?: React.ReactNode }) => (
  <Box pad="large">
    <Heading level={1} color="text">{text}</Heading>
    {children}
  </Box>
)

const FeaturedText = () => (
  <TextBlock text="Featured Patterns"  />
)

const ExploreText = () => (
  <TextBlock text="Explore Patterns">
    <Text>Browse patterns by community members.</Text>
  </TextBlock>
)


export default compose<PatternsPageProps, any>(withAuthentication, withFirebase, withPatterns)(PatternsPage);
