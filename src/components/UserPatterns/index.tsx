import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthorization, WithAuthProps } from '../Session';
import { PatternList } from '../PatternList';
import { DestroyDialog } from "../Patterns/destroy"
import {Box} from "grommet"

type UserPatternsProps = WithAuthProps & WithFirebaseProps & {patterns: PatternData[]}

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const UserPatterns = (props: UserPatternsProps) => {
  console.log("UserPatterns Page", props)
  const { firebase, authUser, patterns } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)

  return (
    <Box pad="medium" className={`${authUser ? 'user' : 'explore'}-grid`}>
      <PatternList
        patterns={patterns}
        onDestroy={authUser ? (pattern: PatternData) => {
          setPatternForDestroy(pattern)
        } : undefined}
      />
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
      </Box>
  )
}

const condition = (authUser?: firebase.User) => !!authUser;

export default compose<UserPatternsProps, any>(withAuthorization(condition), withFirebase)(UserPatterns);