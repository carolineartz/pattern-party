import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthentication, WithAuthProps } from '../Session';
import { PatternList } from './../PatternList';
import { PatternGrid } from "./../Patterns/grid"
import { DestroyDialog } from "./../Patterns/destroy"
import {Box} from "grommet"

type LandingPageProps = WithAuthProps & WithFirebaseProps & {patterns: PatternData[]}

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const LandingPage = React.memo((props: LandingPageProps) => {
  console.log("Landing Page", props)
  const { firebase, authUser, patterns } = props
  const [ patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)
  const userIsAdmin = authUser && (authUser as any).roles && (authUser as any).roles.admin

  return (
    <Box pad="medium" className={`${authUser ? 'user' : 'explore'}-grid`}>
      <PatternGrid>
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
      </PatternGrid>
      {userIsAdmin && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            firebase.pattern(patternForDestroy.id).delete()
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            firebase.pattern(patternForDestroy.id).set({hidden: true}, {merge: true})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
  )
})

export default compose<LandingPageProps, any>(withAuthentication, withFirebase)(LandingPage);
