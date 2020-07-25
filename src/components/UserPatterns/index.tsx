import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthorization, WithAuthProps } from '../Session';
import { PatternList } from '../PatternList';
import { PatternGrid } from "./../Patterns/grid"
import { DestroyDialog } from "../Patterns/destroy"
import {PatternCollectionState} from "./../Patterns/context"

import { Box, Heading } from "grommet"

type UserPatternsProps = WithAuthProps & WithFirebaseProps & { patternCollection?: PatternCollectionState}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const UserPatterns = React.memo((props: UserPatternsProps) => {
  console.log("UserPatterns Page", props)
  const { firebase, authUser, patternCollection } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)

  return (
    <>
      <UserPatternsText key="text-user-patterns" />
      <Box pad={{horizontal: "medium", bottom: "medium"}} width={{max: "1080px"}} margin="auto" css='width: 100%'>
        <PatternGrid>
          <PatternList
            patterns={patternCollection ? patternCollection.patterns : []}
            onDestroy={authUser ? (pattern: PatternData) => {
              setPatternForDestroy(pattern)
            } : undefined}
          />
        </PatternGrid>
      </Box>
      {authUser && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            firebase.userPattern(authUser.uid, patternForDestroy.id).delete()
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            firebase.userPattern(authUser.uid, patternForDestroy.id).set({hidden: true}, {merge: true})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </>
  )
})

const UserPatternsText = () => (
  <TextBlock text="My Patterns"  />
)


const TextBlock = ({ text, children }: { text: string, children?: React.ReactNode }) => (
  <Box pad="large">
    <Heading level={1} color="text">{text}</Heading>
    {children}
  </Box>
)

const condition = (authUser?: firebase.User) => !!authUser;

// withFirebase(export default compose<UserPatternsProps, any>(withAuthorization(condition), withFirebase)(UserPatterns);

export default withFirebase(withAuthorization(condition)(UserPatterns))
