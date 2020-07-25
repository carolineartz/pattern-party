import React from 'react';
import { withAuthentication } from "../Session"

import Firebase, { withFirebase, LIMIT } from "./../Firebase"

export type PatternCollectionState = {
  patterns: PatternData[],
  more: boolean,
  fetch: () => Promise<void>
}

const initialPatternCollectionState = {
  patterns: [],
  more: false,
  fetch: () => Promise.resolve()
}

type IPatternsState = {
  community: PatternCollectionState,
  user?: PatternCollectionState
}

export type WithPatternsProps = IPatternsState

export const initialPatterns: IPatternsState = {
  community: initialPatternCollectionState,
  user: undefined
}

export const PatternsContext = React.createContext<IPatternsState>(initialPatterns);

class Provider extends React.Component<any & { firebase: Firebase, authUser?: firebase.User }, IPatternsState> {
  userPatternsListener?: firebase.Unsubscribe
  communityPatternsListener?: firebase.Unsubscribe

  state = initialPatterns

  fetchPatterns = async (user?: firebase.User, startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => {
    const firebase: Firebase = this.props.firebase

    const initialQuery = user ? firebase.userPatterns(user.uid) : firebase.patterns()
    let query = initialQuery

    if (startAfter) {
      query = query.startAfter(startAfter)
    }

    const snapshots = await query.get()
    const isMore = snapshots.docs.length < LIMIT
    const lastVisible = snapshots.docs[snapshots.docs.length - 1]

    if (user) {
      const currentPats = this.state.user ? this.state.user.patterns : []
      this.setState({
        user: {
          patterns: [...currentPats, ...snapshots.docs.map(pd => pd.data())],
          more: isMore,
          fetch: () => this.fetchPatterns(user, lastVisible)
        }
      })
    } else {
      const currentPats = this.state.community.patterns
      this.setState({
        community: {
          patterns: [...currentPats, ...snapshots.docs.map(pd => pd.data())],
          more: isMore,
          fetch: () => this.fetchPatterns(undefined, lastVisible)
        }
      })
    }
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
                  patterns: [data,...this.state.community.patterns],
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
                  patterns: [data, ...user.patterns]
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
    this.fetchPatterns().then(this.subscribeToCommunityPatterns)

    if (this.props.authUser) {
      this.fetchPatterns(this.props.authUser).then(this.subscribeToUserPatterns)
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
    {(state: IPatternsState) => <Component user={state.user} community={state.community} {...props} />}
  </PatternsConsumer>
);
