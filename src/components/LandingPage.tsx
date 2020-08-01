import React from 'react';
import { compose } from 'recompose';
import { firestore } from "firebase"
import { Box } from "grommet"

import { withFirebase, WithFirebaseProps } from './Firebase';
import { withAuthentication, WithAuthProps } from './Session';
import { PatternList, PatternGrid, DestroyPatternDialog } from './Patterns';

type LandingPageProps = WithAuthProps & WithFirebaseProps & {patterns: PatternData[]}

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
  createdAt?: firebase.firestore.Timestamp
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
            firebase.pattern(patternForDestroy.id).set({hidden: true}, {merge: true})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </Box>
  )
})

export default compose<LandingPageProps, any>(withAuthentication, withFirebase)(LandingPage);