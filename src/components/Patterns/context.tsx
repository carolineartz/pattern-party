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

const initialPatternCollectionState = {
  patterns: [],
  more: true,
}

type IPatternsState = {
  fetchPatterns: (user?: firebase.User, startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternData[]>
  community: PatternCollectionState,
  user?: PatternCollectionState
}

export type WithPatternsProps = IPatternsState

export const initialPatterns: IPatternsState = {
  fetchPatterns: () => Promise.resolve([]),
  community: initialPatternCollectionState,
  user: undefined
}

export const PatternsContext = React.createContext<IPatternsState>(initialPatterns);

class Provider extends React.Component<any & { firebase: Firebase, authUser?: firebase.User }, IPatternsState> {
  userPatternsListener?: firebase.Unsubscribe
  communityPatternsListener?: firebase.Unsubscribe

  state = initialPatterns

  fetchPatterns = async (user?: firebase.User, startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>): Promise<PatternData[]> => {
    console.log("lastVisible", startAfter)
    const firebase: Firebase = this.props.firebase

    const initialQuery = user ? firebase.userPatterns(user.uid) : firebase.patterns()
    let query = initialQuery

    if (startAfter) {
      query = query.startAfter(startAfter)
    }

    const snapshots = await query.get()
    const isMore = snapshots.docs.length >= LIMIT
    const lastVisible = snapshots.docs[snapshots.docs.length - 1]

    let pats: PatternData[]

    if (user) {
      const currentPats = this.state.user ? this.state.user.patterns : []
      pats = uniqBy([...currentPats, ...snapshots.docs.map(pd => pd.data())], 'id')
      this.setState({
        user: {
          patterns: pats,
          more: isMore,
          startAfter: lastVisible
        }
      })
    } else {
      const currentPats = this.state.community.patterns
      pats = uniqBy([...currentPats, ...snapshots.docs.map(pd => pd.data())], 'id')
      this.setState({
        community: {
          patterns:  pats,
          more: isMore,
          startAfter: lastVisible
        }
      })
    }

    return pats
  }

  subscribeToCommunityPatterns = () => {
    const firebase: Firebase = this.props.firebase

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
      this.setState({ user: undefined })
      this.userPatternsListener()
      this.userPatternsListener = undefined
    }

    // signed in
    if (!prevProps.authUser && this.props.authUser && !this.userPatternsListener) {
      this.fetchPatterns(this.props.authUser).then(this.subscribeToUserPatterns)
    }
  }

  componentDidMount() {
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
    {(state: IPatternsState) => <Component fetchPatterns={state.fetchPatterns} user={state.user} community={state.community} {...props} />}
  </PatternsConsumer>
);
