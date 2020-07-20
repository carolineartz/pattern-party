import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthorization, WithAuthProps } from '../Session';
import { PatternList } from './../PatternList';
import { DestroyDialog } from "./../Patterns/destroy"
import {Box} from "grommet"

type ExplorePageProps = WithAuthProps & WithFirebaseProps & {patterns: PatternData[]}

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const ExplorePage = (props: ExplorePageProps) => {
  console.log("ExplorePage", props)
  const { firebase, authUser, patterns } = props
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin

  return (
    <Box pad="medium" className={`${authUser ? 'user' : 'explore'}-grid`}>
      <PatternList
        patterns={patterns}
        onDestroy={userIsAdmin ? (pattern: PatternData) => {
          setPatternForDestroy(pattern)
        } : undefined}
        onSave={authUser ? (pattern: PatternData) => {
          if (authUser) {
            firebase.userPatterns(authUser.uid).add({
              markup: pattern.markup,
              hidden: false
            })
          }
        } : undefined}
      />
      {authUser && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            firebase.pattern(patternForDestroy.id).delete()
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

export default compose<ExplorePageProps, any>(withAuthorization(condition), withFirebase)(ExplorePage);
