import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthorization, WithAuthProps } from '../Session';
import { PatternList } from './../PatternList';
import { DestroyDialog } from "./../Patterns/destroy"
import {Box} from "grommet"

type ExplorePageProps = WithAuthProps & WithFirebaseProps
type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const ExplorePage = ({ authUser, firebase }: ExplorePageProps) => {
  const [loading, setLoading] = React.useState<LoadingState>("not-started")
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)

  React.useEffect(() => {
    if (loading === "not-started") {
      setLoading("loading")

      firebase.patterns().get()
        .then((data: firebase.firestore.QuerySnapshot) => {
          const pats = data.docs
          setPatterns(pats.map((pat) => {
            const data = pat.data()
            return ({
              id: pat.id,
              ...data
            }) as PatternData
          }))

          setLoading("loaded")
        }).catch((err) => {
          console.log(err)
          setLoading("error")
        })
    }

    const unsubscribe = firebase.patterns().onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "added" || change.type === "removed") {
          console.log(change.type, change)
          // fetchPatterns()
        }
        else {
          console.log("change", change);
        }
      });
    });

    return () => {
      unsubscribe()
    }
  }, [firebase, loading])

  const user = authUser && (authUser as any).authUser
  const userIsAdmin = user && user.roles && user.roles.admin

  if (patterns && loading === "loaded") {
    return (
      <>
        <PatternList
          key="pattern-list"
          patterns={patterns}
          onDestroy={userIsAdmin ? (pattern: PatternData) => {
            setPatternForDestroy(pattern)
          } : undefined}
          onSave={user ? (pattern: PatternData) => {
            debugger
            // communityId: pattern.id,
            if (user) {
              firebase.userPatterns(user.uid).add({
                markup: pattern.markup,
                hidden: false
              })
            } else {
              debugger
            }
          } : undefined}
        />
        {user && patternForDestroy &&
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
        </>
    )
  } else {
    return (<Box>{loading}</Box>)
  }
}

const condition = (authUser?: firebase.User) => !!authUser;

export default (withFirebase(withAuthorization(condition)(ExplorePage)))
// export default compose<ExplorePageProps, any>(withFirebase, withAuthorization(condition))(ExplorePage);

