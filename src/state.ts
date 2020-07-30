
import React, { Reducer } from 'react';
import { firestore } from "firebase"
import produce from "immer"
import { createContainer } from 'react-tracked';
import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';
import firebase, { patternConverter } from "./components/firebase"

const DEFAULT_LIMIT = 10

export type VisibilityFilterType =
  | 'SHOW_USER'
  | 'SHOW_COMMUNITY'
  | 'SHOW_FEATURED';

type OwnerType = 'user' | 'community'
type CollectionType = OwnerType | 'featured'
export type PatternId = [string, OwnerType]

export type PatternType = {
  id: string
  markup: string
  featured: boolean
  hidden: boolean
  createdAt?: firebase.firestore.Timestamp
}

export type State = {
  patterns: Map<PatternId, PatternType>
  subscriptions: {
    user?: firebase.Unsubscribe
    community?: firebase.Unsubscribe
    featured?: firebase.Unsubscribe
  },
  fetchPatterns: {
    community: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    },
    user: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    }
    featured: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    }
  }
  visibilityFilter: VisibilityFilterType
  authUser: firebase.User | null
  firebase: firebase | null
  loading : boolean
  error: Error | null
  async?: any
}

const initialState: State = {
  patterns: new Map<PatternId, PatternType>(),
  visibilityFilter: "SHOW_COMMUNITY",
  subscriptions: {},
  fetchPatterns: {
    community: { hasMore: true },
    user: { hasMore: true },
    featured: { hasMore: true }
  },
  authUser: null,
  firebase: null,
  loading: false,
  error: null
}

type PatternTypeData = {
  id: PatternId
  pattern: Partial<Omit<PatternType, 'markup' | 'id' | 'createdAt'>> & Pick<PatternType, 'createdAt' | 'id' | 'markup'>
}

type Action =
  | { type: 'START' }
  | { type: 'STARTED'; firebase: firebase }
  | { type: 'SUBSCRIBED_TO_PATTERNS', collection: CollectionType, listener: firebase.Unsubscribe }
  | { type: 'PATTERNS_FETCHED' }
  | { type: 'PATTERN_CREATED', pattern?: PatternType }
  | { type: 'FETCH_PATTERNS_FAILED', error: Error }
  | { type: 'PATTERNS_RECEIVED'; patterns: PatternTypeData[], lastVisible?: firebase.firestore.QueryDocumentSnapshot<PatternType>, hasMore: boolean, collection: CollectionType }
  | { type: 'PATTERN_RECEIVED'; id: PatternId, pattern: PatternType }
  | { type: 'PATTERN_DELETED'; id: PatternId, foo?: any }
  | { type: 'PATTERN_HIDDEN'; id: PatternId }
  | { type: 'PATTERN_FEATURED'; id: PatternId }
  | { type: 'SUBSCRIBED_TO_AUTH'; listener: firebase.Unsubscribe }
  | { type: 'USER_LOGGED_IN', user: firebase.User}
  | { type: 'USER_LOGGED_OUT' }
  | { type: 'FIREBASE_CONNECTION_ERRORED' }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'START': return {
      ...state,
      loading: true
    }
    case 'STARTED': return {
        ...state,
        loading: false,
        firebase: action.firebase
    }
    case 'PATTERNS_FETCHED': return {
      ...state,
      loading: true
    }
    case 'SUBSCRIBED_TO_PATTERNS': {
      return produce(state, draftState => {
        switch (action.collection) {
          case 'community':
            draftState.subscriptions.community = action.listener
            break
          case 'user':
            draftState.subscriptions.user = action.listener
            break
          case 'featured':
            draftState.subscriptions.featured = action.listener
        }
      })
    }
    case 'PATTERNS_RECEIVED':
      return produce(state, draftState => {
        draftState.loading = false

        action.patterns.forEach(({id, pattern}: PatternTypeData) => {
          draftState.patterns.set(id, {featured: false, hidden: false, ...pattern})
        })

        switch (action.collection) {
          case 'community':
            draftState.fetchPatterns.community.startAfter = action.lastVisible
            draftState.fetchPatterns.community.hasMore = action.hasMore
            break
          case 'user':
            draftState.fetchPatterns.user.startAfter = action.lastVisible
            draftState.fetchPatterns.user.hasMore = action.hasMore
            break
          case 'featured':
            draftState.fetchPatterns.featured.hasMore = action.hasMore
        }
      })
    case 'PATTERN_RECEIVED':
      return produce(state, draftState => {
        draftState.loading = false
        draftState.patterns.set(action.id, action.pattern)
      })
    case 'PATTERN_DELETED':
      action.foo.then(() => {
        debugger
      })
      console.log("delete action", action)
      return produce(state, draftState => {
        draftState.patterns.delete(action.id)
      })
    case 'PATTERN_FEATURED':
      return produce(state, draftState => {
        const pattern = draftState.patterns.get(action.id)
        if (pattern) {
          pattern.featured = true
        } else {
          console.log("no pattern found!", action.id)
        }
        draftState.loading = false
      })
    case 'PATTERN_HIDDEN':
      return produce(state, draftState => {
        const pattern = draftState.patterns.get(action.id)
        if (pattern) {
          pattern.hidden = true
        } else {
          console.log("no pattern found!", action.id)
        }
      })
    case 'SUBSCRIBED_TO_AUTH':
      return produce(state, draftState => {
        draftState.subscriptions.user = action.listener
      })
    case 'USER_LOGGED_IN':
      return produce(state, draftState => {
        draftState.authUser = action.user
      })
    case 'USER_LOGGED_OUT':
      return produce(state, draftState => {
        draftState.authUser = null
      })
    case 'PATTERN_CREATED': return {
      ...state,
      loading: false
    }
    default:
      throw new Error('unknown action type');
  }
};

type AsnycActionStartApp = { type: 'START_APP' }

type AsyncActionCommunitySubscribe = { type: 'SUBSCRIBE_TO_COMMUNITY_PATTERNS' };
type AsyncActionFeaturedSubscribe = { type: 'SUBSCRIBE_TO_FEATURED_PATTERNS' };
type AsyncActionUserSubscribe = { type: 'SUBSCRIBE_TO_USER_PATTERNS' };

type AsyncActionFetchUserPatterns = { type: 'FETCH_USER_PATTERNS', step?: number }
type AsyncActionFetchCommunityPatterns = { type: 'FETCH_COMMUNITY_PATTERNS', step?: number }
type AsyncActionFetchFeaturedPatterns = { type: 'FETCH_FEATURED_PATTERNS', limit?: number }

type AsyncActionCreatePattern = { type: 'CREATE_PATTERN'; markup: string, owner: OwnerType };
type AsyncActionDeletePattern = { type: 'DELETE_PATTERN'; id: PatternId };
type AsyncActionHidePattern = { type: 'HIDE_PATTERN'; id: PatternId };
type AsyncActionFeaturePattern = { type: 'FEATURE_PATTERN'; id: PatternId };

type AsyncActionSubscribeToAuth = { type: 'SUBSCRIBE_TO_AUTH' }
type AsyncActionLoginUser = { type: 'LOGIN_USER' };
type AsyncActionLogoutUser = { type: 'LOGOUT_USER' };

type AsyncActionPayload = { type: 'PAYLOAD', promise: Promise<any> };

type AsyncAction =
  | AsnycActionStartApp
  | AsyncActionCommunitySubscribe
  | AsyncActionFeaturedSubscribe
  | AsyncActionUserSubscribe
  | AsyncActionFetchUserPatterns
  | AsyncActionFetchCommunityPatterns
  | AsyncActionFetchFeaturedPatterns
  | AsyncActionCreatePattern
  | AsyncActionDeletePattern
  | AsyncActionHidePattern
  | AsyncActionFeaturePattern
  | AsyncActionSubscribeToAuth
  | AsyncActionLoginUser
  | AsyncActionLogoutUser
  | AsyncActionPayload

const asyncActionHandlers: AsyncActionHandlers<
  Reducer<State, Action>,
  AsyncAction
  > = {
  START_APP: ({ dispatch }) => async () => {
    dispatch({ type: 'STARTED', firebase: new firebase() })
  },

  SUBSCRIBE_TO_COMMUNITY_PATTERNS: ({ dispatch, getState }) => async () => {
    const { firebase } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    const listener = firebase.patterns().onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            dispatch({ type: "PATTERN_RECEIVED", id: [change.doc.id, 'community'], pattern: change.doc.data() })
          }
        })
      })

    dispatch({type: "SUBSCRIBED_TO_PATTERNS", collection: "community", listener})
  },

  SUBSCRIBE_TO_FEATURED_PATTERNS: ({ dispatch, getState }) => async () => {
    const { firebase } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    // TODO: Not sure if this is actually what i want to listen to...
    const listener = firebase.featuredPatterns()
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            dispatch({ type: "PATTERN_RECEIVED", id: [change.doc.id, 'community'], pattern: change.doc.data() })
          }
        })
      })

    dispatch({type: "SUBSCRIBED_TO_PATTERNS", collection: "featured", listener})
  },

  SUBSCRIBE_TO_USER_PATTERNS: ({ dispatch, getState }) => async () => {
    const { firebase, authUser } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (!authUser) {
      console.log("HANDLE ME: NO USER!")
      return
    }

    const listener = firebase.userPatterns(authUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            dispatch({ type: "PATTERN_RECEIVED", id: [change.doc.id, 'user'], pattern: change.doc.data() })
          }
        })
      })

    dispatch({type: "SUBSCRIBED_TO_PATTERNS", collection: "user", listener})
  },

  FETCH_COMMUNITY_PATTERNS: ({ dispatch, getState }) => async (action) => {
    const limit = action.step || DEFAULT_LIMIT

    const { firebase, fetchPatterns: {community: {startAfter, hasMore}} } = getState()
    // debugger

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (!hasMore) {
      console.log("No more patterns to fetch!")
      return
    }

    const query = startAfter ? firebase.patterns().startAfter(startAfter) : firebase.patterns()
    try {
      const snapshots = await query.get()
      // debugger
      dispatch({ type: "PATTERNS_FETCHED" })

      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      const noMore = snapshots.docs.length < limit || (startAfter && startAfter.id === lastVisible.id)

      dispatch({
        type: "PATTERNS_RECEIVED",
        patterns: snapshots.docs.map(pd => ({ id: [pd.id, 'community'], pattern: pd.data() })),
        lastVisible,
        hasMore: !noMore,
        collection: 'community'
      })
    } catch (error) {
      dispatch({type: 'FETCH_PATTERNS_FAILED', error})
    }
  },

  FETCH_USER_PATTERNS: ({ dispatch, getState }) => async (action) => {
    const limit = action.step || DEFAULT_LIMIT

    const { firebase, authUser, fetchPatterns: {user: {startAfter, hasMore}} } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (!authUser) {
      console.log("HANDLE ME: NO USER!")
      return
    }

    if (!hasMore) {
      console.log("No more patterns to fetch!")
      return
    }

    const query = startAfter ? firebase.userPatterns(authUser.uid ).startAfter(startAfter) : firebase.userPatterns(authUser.uid )
    try {
      dispatch({ type: "PATTERNS_FETCHED" })

      const snapshots = await query.get()
      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      const noMore = snapshots.docs.length < limit || (startAfter && startAfter.id === lastVisible.id)

      dispatch({
        type: "PATTERNS_RECEIVED",
        patterns: snapshots.docs.map(pd => ({ id: [pd.id, 'user'], pattern: pd.data() })),
        lastVisible,
        hasMore: !noMore,
        collection: 'user'
      })
    } catch (error) {
      dispatch({type: 'FETCH_PATTERNS_FAILED', error})
    }
  },

  FETCH_FEATURED_PATTERNS: ({ dispatch, getState }) => async () => {
    const limit = 15

    const { firebase, fetchPatterns: {featured: hasMore} } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (!hasMore) {
      console.log("No more featured patterns to fetch!")
      return
    }

    const query = firebase.featuredPatterns(limit)
    try {
      dispatch({ type: "PATTERNS_FETCHED" })

      const snapshots = await query.get()

      dispatch({
        type: "PATTERNS_RECEIVED",
        patterns: snapshots.docs.map(pd => ({ id: [pd.id, 'community'], pattern: pd.data() })),
        hasMore: false,
        collection: 'featured'
      })
    } catch (error) {
      dispatch({type: 'FETCH_PATTERNS_FAILED', error})
    }
  },

  CREATE_PATTERN: ({ dispatch, getState, signal }) => async (action) => {
    const { firebase, authUser } = getState()
    console.log("create signal", signal)
    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (!authUser) {
      console.log("HANDLE ME: NO USER!")
      return
    }

    dispatch({type: "PATTERNS_FETCHED"})

    // add to the user's patterns
    try {
      const patternRefPromise = firebase.userPatternCollection(authUser.uid).add({
        markup: action.markup,
        hidden: false,
        featured: false,
        createdAt: firestore.Timestamp.now()
      })

      // debugger
      const patternRef = await patternRefPromise
      // debugger
      const patternDoc = await patternRef.withConverter(patternConverter).get()
      const pattern = patternDoc.data()
      if (pattern) {
        dispatch({type: 'PATTERN_CREATED', pattern})
      } else {
        console.log("didn't write")
      }
    } catch (e) {
      debugger
    }

    // debugger

    // add to the community patterns
    if (action.owner === "user") {
      try {
        const foos = await firebase.patternCollection().add({
          markup: action.markup,
          hidden: false,
          featured: false,
          createdAt: firestore.Timestamp.now()
        })
        dispatch({type: 'PATTERN_CREATED'})
        console.log(foos)
        debugger
      } catch (e) {
        debugger
      }
    }

    // the items are populated via the subscriptions so don't do it here.
  },

  DELETE_PATTERN: ({ dispatch, getState, signal }) => async (action) => {
    console.log("delete signal", signal)
    const [pid, owner] = action.id

    const { firebase, authUser } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (owner === "user" && !authUser) {
      console.log("HANDLE ME! Not the user is to delete a user's pattern!")
      return
    }

    if (owner === "user" && authUser) {
      const foo = firebase.userPattern(authUser.uid, pid).delete()
      // console.log("delete signal", signal, foo)
      // foo.then(() => {
      //   debugger
      //   dispatch({ type: "PATTERN_DELETED", id: action.id, foo })
      // })
      dispatch({ type: "PATTERN_DELETED", id: action.id, foo })
    }
      // return dispatch({type: "PATTERN_DELETED", id: action.id, res: (await foo)})
    //   const bar = await foo
    //   console.log("delete signal", signal, bar)

    //   dispatch({type: "PATTERN_DELETED", id: action.id})
    // } else if (owner === "community") {
    //   firebase.pattern(pid).delete()
    //    dispatch({type: "PATTERN_DELETED", id: action.id})
    // }

    // console.log("deleting anyway?")
    // dispatch({type: "PATTERN_DELETED", id: action.id})
  },

  HIDE_PATTERN: ({ dispatch, getState }) => async (action) => {
    const [pid, owner] = action.id

    const { firebase, authUser } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (owner === "user" && !authUser) {
      console.log("HANDLE ME! Not the user is to hide a user's pattern!")
      return
    }

    if (owner === "user" && authUser) {
      firebase.userPattern(authUser.uid, pid).set({hidden: true}, {merge: true})
      dispatch({type: "PATTERN_HIDDEN", id: action.id})
    } else if (owner === "community") {
      firebase.pattern(pid).set({ hidden: true }, { merge: true })
       dispatch({type: "PATTERN_HIDDEN", id: action.id})
    }
  },

  FEATURE_PATTERN: ({ dispatch, getState }) => async (action) => {
    const [pid, owner] = action.id

    const { firebase, authUser } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    if (owner === "user") {
      console.log("HANDLE ME! Can't feature a user's pattern!")
      return
    }

    firebase.pattern(pid).set({ featured: true }, { merge: true })
    dispatch({type: "PATTERN_FEATURED", id: action.id})
  },

  SUBSCRIBE_TO_AUTH: ({ dispatch, getState }) => async () => {
    const { firebase } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    const successHandler = (user: firebase.User) => {
      dispatch({type: 'USER_LOGGED_IN', user})
    }

    const fallbackHandler = () => {
      console.log("fallback")
      // dispatch({type: 'USER_LOGGED_OUT'})
    }

    const listener = firebase.onAuthUserListener(successHandler, fallbackHandler)
    dispatch({type: "SUBSCRIBED_TO_AUTH", listener})
  },

  LOGIN_USER: ({ getState }) => async () => {
    const { firebase } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    try {
      const foo = await firebase.doSignInWithGoogle()
      debugger
    } catch (e) {
      debugger
    }
  },

  LOGOUT_USER: ({ getState }) => async () => {
    const { firebase } = getState()

    if (!firebase) {
      console.log("HANDLE ME: NO FIREBASE!")
      return
    }

    try {
      await firebase.doSignOut()
    } catch (e) {
      console.error("oops", e)
    }
  },

  PAYLOAD: ({ getState, dispatch }) => async (action) => {

  }
};


// function useAsyncReducer
// function useAsyncDispatcher<T>(fn: (action: T, dispatch: ((action: T) => any)) => void) {
//   return React.useMemo(() =>
//     function dispatch(action: T) {
//       return fn(action, dispatch)
//     }, [])
// }

// function useAsyncNamedDispatcher<T extends { type: string }>(provider: () => { [type: string]: Function }) {
//   const fnObj = React.useMemo(provider, [])

//   return useAsyncDispatcher<T>((action, dispatch) => {
//     if (action.type in fnObj)
//       fnObj[action.type](action, dispatch)
//     else
//       throw new Error('Missing handler for action ' + action.type)
//   })
// }

// function useFirebaseRequest<R, A> = (endpoint, { verb = 'get', params = {} } = {}) {
//     const [state, dispatch] = React.useReducer(reducer, initialState);

//     const makeRequest = React.useCallback(async () => {
//         dispatch(fetching());
//         try {
//             const response = await axios[verb](endpoint, params);
//             dispatch(success(response));
//         } catch (e) {
//             dispatch(error(e));
//         }
//     }, [endpoint, verb, params]);

//     return [state, makeRequest];
// };

const useValue = () =>
  useReducerAsync<Reducer<State, Action>, AsyncAction>(
    reducer,
    initialState,
    asyncActionHandlers,
  );

export const {
  Provider,
  useTrackedState,
  useUpdate: useDispatch,
} = createContainer(useValue);


export const useAsyncDispatch = () => {
  const dispatch = useDispatch()
  return React.useCallback(async action => {
    return dispatch(action)
    console.log(action)
  }, [dispatch])
}
