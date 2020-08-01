import React from 'react';
import "styled-components/macro"
import { firestore } from "firebase"

import { PatternList } from './PatternList';
import { PatternGrid } from "./Patterns/grid"
import { DestroyDialog } from "./Patterns/destroy"
import { Box, Heading, Text } from "grommet"
import * as ROUTES from '../constants/routes';
import { patternConverter } from './../firebase'
import firebase from "./../firebase"

import { useDispatch, useTrackedState } from './../state';
import {communityPatterns, featuredPatterns} from "./../util"

type CommunityPatternProps = {
  location: any
}

const CommunityPatterns = (props: CommunityPatternProps) => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const { authUser, patterns, firebase } = state
  const [ready, setReady] = React.useState<boolean>(false)
  const isFeaturedPatterns = props.location.pathname === ROUTES.LANDING
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)
  const user = authUser as any
  const userIsAdmin = user && user.roles && user.roles.admin
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (authUser) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [authUser, setReady])

  // const foo = ((pattern: PatternType) => {
  //   return firebase!.userPatternCollection(authUser!.uid).add({
  //     markup: pattern.markup,
  //     hidden: false,
  //     featured: false,
  //     createdAt: firestore.Timestamp.now()
  //   }).then(() => {
  //     setLoading(false)
  //   })
  //   // if (firebase && authUser) {
  //   // } else {
  //   //   return Promise.resolve(false)
  //   // }
  // })

  // const getData = (ref) => {
  //   return new Promise((resolve, reject) => {
  //     const onError = (error = reject(error));
  //     const onData = (snap) => resolve(snap.val());

  //     ref.on("value", onData, onError);
  //   });
  // };

  // getData(ref)
  //   .then((value) => {
  //     // resolve() was called
  //   })
  //   .catch((error) => {
  //     // reject() was called
  //     // Something went wrong while fetching the data.
  //     // Handle that error here.
  //   });

  const handleClickSave = async (pattern: PatternType) => {
    setLoading(true)

    try {
      const foo = await add(firebase, authUser!.uid, {
        markup: pattern.markup,
        hidden: false,
        featured: false,
        createdAt: firestore.Timestamp.now()
      })
      debugger
      return foo
      // return foo
      // setLoading(false)
      // console.log("foo", foo)
    } catch (e) {
      console.error("nope!", e)
      return
    }
  }

  const handleClickSavePattern = async (pattern: PatternType) => {
    if (firebase && authUser) {

      // add to the user's patterns
      try {
        const patternRef = await firebase.userPatternCollection(authUser.uid).add({
          markup: pattern.markup,
          hidden: false,
          featured: false,
          createdAt: firestore.Timestamp.now()
        })

        const patternDoc = await patternRef.withConverter(patternConverter).get()
        return patternDoc.data()
        // console.log(patternResp)
        // if (patternResp) {
        //   // shouldn't actually need to do this...just trying to see if it makes a difference ... subscription to create events should populate the pattern wehn it successfully writes to backend
        //   // pattern arg is optional/temporary until figure out the whole async action issue
        //   dispatch({type: 'PATTERN_CREATED', pattern: patternResp})
        // } else {
        //   console.log("didn't write")
        // }
      } catch (e) {
        console.warn("error in create pattern", e)
      }
    }
  }

  return (
    <>
    <Box pad="large">
      <Heading level={1} color="text">{isFeaturedPatterns ? "Featured Patterns" : "Community Patterns"}</Heading>
      {!isFeaturedPatterns && <Text>Browse patterns by community members.</Text>}
    </Box>
      {communityPatterns(patterns).length &&
        <Box pad={{horizontal: "medium", bottom: "medium"}} width={{max: "1080px"}} margin="auto" css='width: 100%'>
          <PatternGrid>
            <PatternList
            patterns={isFeaturedPatterns ? featuredPatterns(patterns) : communityPatterns(patterns)}
            onClickDestroy={userIsAdmin ? (pattern: PatternType) => {
              setPatternForDestroy(pattern)
            } : undefined}
            onClickSave={firebase && authUser && ready ? (pattern: PatternType) => handleClickSavePattern(pattern) : undefined}
                // setLoading(true)
                // return add(firebase, authUser.uid, {
                //   markup: pattern.markup,
                //   hidden: false,
                //   featured: false,
                //   createdAt: firestore.Timestamp.now()
                // }).then(() => {
                //   setLoading(false)
                // }).catch((e) => {
                //   debugger
                // })
                // dispatch({type: "CREATE_PATTERN", markup: pattern.markup, owner: "community"})
                // setLoading(true)
                // foo(pattern).then((bar: unknown) => {
                //   console.log(bar)
                //   setLoading(false)
                //   console.log("loading: false")
                // }).catch(e => {
                //   console.error(e)
                // })

                // debugger
              // const patternResp = await handleClickSavePattern(pattern)
              // debugger
              // } : undefined}
            />
        </PatternGrid>
        {loading && <Box>loading!</Box>}
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

export default CommunityPatterns


function add(firebase: any, id: string, data: any): Promise<firestore.DocumentReference<firestore.DocumentData>> {
  console.log("adding")
  return new Promise((resolve, reject) => {
    (firebase as firebase)
      .userPatternCollection(id)
      .add(data)
      .then((d: firestore.DocumentReference<firestore.DocumentData>) => {
        debugger
        resolve(d)
      })
      .catch((e: any) => {
        debugger
        reject(e)
      })
  })
}
