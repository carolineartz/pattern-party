import React from 'react';
import { compose } from 'recompose';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { withAuthentication, WithAuthProps } from '../Session';
import { PatternList } from './../PatternList';
import { DestroyDialog } from "./../Patterns/destroy"
import {Box} from "grommet"

type LandingPageProps = WithAuthProps & WithFirebaseProps
type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const LandingPage = (props: any) => {
  console.log("landingPage", props)
  const { firebase, authUser } = props

  const [patterns, setPatterns] = React.useState<PatternData[]>([])
  // const [patternCollectionRef, setPatternCollectionRef] = React.useState<firebase.firestore.CollectionReference>(firebase.patterns())
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternData | null>(null)

  const patternCollectionRef = React.useRef<firebase.firestore.CollectionReference>()

  // React.useEffect(() => {
  //   setPatterns()
  // }, [authUser])

  React.useEffect(() => {
    setPatterns([])
    if (authUser) {
      patternCollectionRef.current = firebase.userPatterns(authUser.uid)
    } else {
      patternCollectionRef.current = firebase.patterns()
    }

    let unsubscribe: firebase.Unsubscribe | undefined

    if (patternCollectionRef.current) {
      unsubscribe = patternCollectionRef.current.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          const id: string = change.doc.id
          const data: firebase.firestore.DocumentData = change.doc.data()

          switch (change.type) {
            case "added":
              setPatterns((pdata: PatternData[]) => [{ markup: data.markup, id, hidden: data.hidden || false }, ...pdata])
              break
            case "removed":
              setPatterns((pdata: PatternData[]) => pdata.filter((p: PatternData) => p.id !== data.id))
              break
            case "modified":
              console.log("was modified", change)
              // if (data) {
              //   setPatterns((pdata: PatternData[] | undefined) => {
              //     if (pdata) {
              //       const changed = pdata.find((p: PatternData) => p.id === data.id)
              //       if (changed) {
              //         changed.markup = data.markup
              //         changed.hidden = data.hidden || false
              //       }
              //     }

              //     return pdata
              //   })
              // }
          }
        });
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [authUser, firebase])

  // const fetchPatterns = React.useCallback(() => {
  //   setLoading("loading")

  //   return
  // }, [patternCollectionRef])

  // React.useEffect(() => {
  //   if (patternCollectionRef) {
  //     setLoading("not-started")
  //   }
  // }, [setLoading, patternCollectionRef])

  // React.useEffect(() => {
  //   let unsubscribe: firebase.Unsubscribe

  //   if (authUser) {
  //     setPatternCollectionRef(firebase.userPatterns(authUser.uid))
  //   }

  //   if (loading === "not-started") {
  //     unsubscribe = fetchPatterns()
  //   }

  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe()
  //     }
  //   }
  // }, [authUser, fetchPatterns, firebase, loading])


    return (
      <Box className={`${authUser ? 'user' : 'explore'}-grid`}>
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

export default compose<LandingPageProps, any>(withAuthentication, withFirebase)(LandingPage);
