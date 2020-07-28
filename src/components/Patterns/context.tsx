import React from 'react';
import { withAuthentication } from "../Session"
import uniqBy from "lodash.uniqby"

import Firebase, { withFirebase, LIMIT } from "./../Firebase"

const DEFAULT_FETCH = () => Promise.resolve()
export type PatternCollectionState = {
  patterns: PatternData[],
  more: boolean,
  startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>
}

const initialPatternCollectionState: PatternCollectionState = {
  patterns: [],
  more: true,
}

// fetchPatterns: (user?: firebase.User, startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternData[]>
type IPatternsState = {
  community: PatternCollectionState,
  user?: PatternCollectionState,
  hasMoreCommunityPatterns: boolean
  hasMoreUserPatterns: boolean
  featuredPatterns: PatternData[]
  fetchUserPatterns?: (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternDataResponse>
  fetchCommunityPatterns?: (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternDataResponse>
  setCommunityPatterns?: (data: PatternDataResponse) => void
  setUserPatterns?: (data: PatternDataResponse) => void
  setHasMoreCommunityPatterns: (hasMore: boolean) => void
  setHasMoreUserPatterns: (hasMore: boolean) => void
}

export type WithPatternsProps = IPatternsState

export const initialPatterns: IPatternsState = {
  community: initialPatternCollectionState,
  hasMoreCommunityPatterns: true,
  hasMoreUserPatterns: true,
  featuredPatterns: [],
  setHasMoreUserPatterns: (hasMore: boolean) => {},
  setHasMoreCommunityPatterns: (hasMore: boolean) => {}
}

export const PatternsContext = React.createContext<IPatternsState>(initialPatterns);

class Provider extends React.Component<any & { firebase: Firebase, authUser?: firebase.User }, IPatternsState> {
  userPatternsListener?: firebase.Unsubscribe
  communityPatternsListener?: firebase.Unsubscribe
  fetchUserPatterns?: (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternDataResponse>

  constructor(props: any) {
    super(props)

    if (props.authUser) {
      this.createFetchUserPatterns(props.authUser)
    }

    this.state = {
      community: initialPatternCollectionState,
      fetchUserPatterns: this.fetchUserPatterns,
      fetchCommunityPatterns: this.fetchCommunityPatterns,
      setCommunityPatterns: this.setCommunityPatterns,
      setUserPatterns: this.setUserPatterns,
      hasMoreCommunityPatterns: true,
      hasMoreUserPatterns: true,
      featuredPatterns: [],
      setHasMoreCommunityPatterns: this.setHasMoreCommunityPatterns,
      setHasMoreUserPatterns: this.setHasMoreUserPatterns
    }
  }

  setHasMoreCommunityPatterns = (hasMore: boolean) => {
    this.setState({
      hasMoreCommunityPatterns: hasMore
    })
  }

  setHasMoreUserPatterns = (hasMore: boolean) => {
    this.setState({
      hasMoreUserPatterns: hasMore
    })
  }

  setCommunityPatterns = (resp: PatternDataResponse) => {
    this.setState({
      hasMoreCommunityPatterns: resp.more,
      user: this.state.user,
      community: {
        ...this.state.community,
        ...resp,
        patterns: resp.items
      }
    })
  }

  setUserPatterns = (resp: PatternDataResponse) => {
    const user = this.state.user || initialPatternCollectionState
    this.setState({
      hasMoreUserPatterns: resp.more,
      community: this.state.community,
      user: {
        ...user,
        ...resp,
        patterns: resp.items
      }
    })
  }

  fetchCommunityPatterns = async (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>): Promise<PatternDataResponse> => {
    const firebase: Firebase = this.props.firebase
    const query = startAfter ? firebase.patterns().startAfter(startAfter) : firebase.patterns()

    const snapshots = await query.get()
    const lastVisible = snapshots.docs[snapshots.docs.length - 1]
    const noMore = snapshots.docs.length < LIMIT || (startAfter && startAfter.id === lastVisible.id)

    return {
      more: !noMore,
      lastVisible,
      items: snapshots.docs.map(pd => pd.data())
    }
  }

  createFetchUserPatterns = (user: firebase.User) => {
    this.fetchUserPatterns = async (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>): Promise<PatternDataResponse> => {
      const firebase: Firebase = this.props.firebase
      const query = startAfter ? firebase.userPatterns(user.uid).startAfter(startAfter) : firebase.userPatterns(user.uid)

      const snapshots = await query.get()
      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      const noMore = snapshots.docs.length < LIMIT || (startAfter && startAfter.id === lastVisible.id)

      return {
        more: !noMore,
        lastVisible,
        items: snapshots.docs.map(pd => pd.data())
      }
    }
  }

  getFeaturedPatterns = async () => {
    console.log("calling getFeaturedPatterns")
    const firebase: Firebase = this.props.firebase

    const snapshots = await firebase.featuredPatterns().get()

    this.setState({
      featuredPatterns: snapshots.docs.map(pd => pd.data())
    })
  }

  subscribeToCommunityPatterns = () => {
    const firebase: Firebase = this.props.firebase

    if (this.communityPatternsListener) {
      return
    }

    this.communityPatternsListener = firebase.patterns()
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const id: string = change.doc.id
          const data: PatternData = change.doc.data()

          switch (change.type) {
            case "added":
              if (this.state.community.patterns.find((pData: PatternData) => id === pData.id)) {
                return
              }

              this.setState({
                community: {
                  ...this.state.community,
                  startAfter: change.doc,
                  patterns: uniqBy([data,...this.state.community.patterns], 'id'),
                }
              })
              // console.log("community pattern was added", change)
              break
          }
        });
    });
  }

  subscribeToUserPatterns = () => {
    if (!this.props.authUser) {
      this.setState({ user: undefined })
      return
    }

    if (this.userPatternsListener) {
      return
    }

    const firebase: Firebase = this.props.firebase

    this.userPatternsListener = firebase.userPatterns(this.props.authUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const id: string = change.doc.id
          const data: PatternData = change.doc.data()

          switch (change.type) {
            case "added":
              const initalPatterns = this.state.user ? this.state.user.patterns : []

              if (initalPatterns.find((pData: PatternData) => id === pData.id)) {
                return
              }
              const user = this.state.user || initialPatternCollectionState

              this.setState({
                user: {
                  ...user,
                  startAfter: change.doc,
                  patterns: uniqBy([data, ...user.patterns], 'id')
                }
              })
              // console.log("user pattern was added", change)
              break
          }
        });
    });
  }

  componentDidUpdate(prevProps: { authUser?: firebase.User }) {
    // signed out
    if (prevProps.authUser && !this.props.authUser && this.userPatternsListener) {
      this.setState({ user: undefined, fetchUserPatterns: undefined })
      this.userPatternsListener()
      this.userPatternsListener = undefined
    }

    // signed in
    if (!prevProps.authUser && this.props.authUser) {
      this.createFetchUserPatterns(this.props.authUser)

      this.setState({
        fetchUserPatterns: this.fetchUserPatterns,
        user: initialPatternCollectionState
      })

      if (!this.userPatternsListener) {
        this.subscribeToUserPatterns()
      }
    }
  }

  componentDidMount() {
    this.getFeaturedPatterns()

    this.subscribeToCommunityPatterns()
    // this.fetchPatterns().then(this.subscribeToCommunityPatterns)

    if (this.props.authUser) {
      this.subscribeToUserPatterns()
      // this.fetchPatterns(this.props.authUser).then(this.subscribeToUserPatterns)
    }
  }

  componentWillUnmount() {
    this.userPatternsListener && this.userPatternsListener()
    this.communityPatternsListener && this.communityPatternsListener()
  }

  render() {
    return (
      <PatternsContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </PatternsContext.Provider>
    )
  }
}

export const PatternsProvider = withFirebase(withAuthentication(Provider))

export const PatternsConsumer = PatternsContext.Consumer as any

export const withPatterns = (Component:any) => (props:any): JSX.Element => (
  <PatternsConsumer>
    {(state: IPatternsState) =>
      <Component
        user={state.user}
        community={state.community}
        setCommunityPatterns={state.setCommunityPatterns}
        setUserPatterns={state.setUserPatterns}
        fetchUserPatterns={state.fetchUserPatterns}
        fetchCommunityPatterns={state.fetchCommunityPatterns}
        hasMoreCommunityPatterns={state.hasMoreCommunityPatterns}
        setHasMoreCommunityPatterns={state.setHasMoreCommunityPatterns}
        hasMoreUserPatterns={state.hasMoreUserPatterns}
        setHasMoreUserPatterns={state.setHasMoreUserPatterns}
        featuredPatterns={state.featuredPatterns}
        {...props}
      />}
  </PatternsConsumer>
);


  // fetchPatterns = async (user?: firebase.User, startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>): Promise<PatternData[]> => {
  //   console.log("lastVisible", startAfter)
  //   const firebase: Firebase = this.props.firebase

  //   const initialQuery = user ? firebase.userPatterns(user.uid) : firebase.patterns()
  //   let query = initialQuery

  //   if (startAfter) {
  //     query = query.startAfter(startAfter)
  //   }

  //   const snapshots = await query.get()
  //   const more = snapshots.docs.length >= LIMIT
  //   const lastVisible = snapshots.docs[snapshots.docs.length - 1]

  //   let pats: PatternData[]

  //   if (user) {
  //     const currentPats = this.state.user ? this.state.user.patterns : []
  //     pats = uniqBy([...currentPats, ...snapshots.docs.map(pd => pd.data())], 'id')
  //     this.setState({
  //       user: {
  //         patterns: pats,
  //         more: more,
  //         startAfter: lastVisible
  //       }
  //     })
  //   } else {
  //     const currentPats = this.state.community.patterns
  //     pats = uniqBy([...currentPats, ...snapshots.docs.map(pd => pd.data())], 'id')
  //     this.setState({
  //       community: {
  //         patterns:  pats,
  //         more: more,
  //         startAfter: lastVisible
  //       }
  //     })
  //   }

  //   return pats
  // }
