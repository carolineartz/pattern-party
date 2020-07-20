import React from 'react';
import { withAuthentication } from "../Session"

import Firebase, {withFirebase} from "./../Firebase"

type PatternData = {
  id: string
  markup: string
  hidden: boolean
}

type IPatternsState = {
  communityPatterns: PatternData[],
  userPatterns: PatternData[]
}

export type WithPatternsProps = IPatternsState

export const initialPatterns: IPatternsState = {
  communityPatterns: [],
  userPatterns: []
}

export const PatternsContext = React.createContext<IPatternsState>(initialPatterns);

class Provider extends React.Component<any & { firebase: Firebase, authUser?: firebase.User }, IPatternsState> {
  userPatternsListener?: firebase.Unsubscribe
  communityPatternsListener?: firebase.Unsubscribe

  state = initialPatterns


  subscribeToCommunityPatterns = () => {
    const firebase: Firebase = this.props.firebase

    this.communityPatternsListener = firebase.patterns()
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const id: string = change.doc.id
          const data: firebase.firestore.DocumentData = change.doc.data()

          switch (change.type) {
            case "added":
              this.setState({
                communityPatterns: [
                  { markup: data.markup, id, hidden: data.hidden || false },
                  ...this.state.communityPatterns
                ]
              })
              console.log("community pattern was added", change)
              break
            case "removed":
              this.setState({ communityPatterns: this.state.communityPatterns.filter((p: PatternData) => p.id !== id) })
              console.log("community pattern was removed", change)
              break
            case "modified":
              const patterns = [...this.state.communityPatterns]
              let changedPattern = patterns.find(pat => pat.id === id)
              if (changedPattern) {
                changedPattern = { ...changedPattern, ...data}
              }
              this.setState({ communityPatterns: patterns })
              console.log("community pattern was modified", change)
          }
        });
    });
  }

  subscribeToUserPatterns = () => {
    if (!this.props.authUser) {
      this.setState({ userPatterns: [] })
      return
    }

    const firebase: Firebase = this.props.firebase

    this.userPatternsListener = firebase.userPatterns(this.props.authUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const id: string = change.doc.id
          const data: firebase.firestore.DocumentData = change.doc.data()

          switch (change.type) {
            case "added":
              this.setState({
                userPatterns: [
                  { markup: data.markup, id, hidden: data.hidden || false },
                  ...this.state.userPatterns
                ]
              })
              console.log("user pattern was added", change)
              break
            case "removed":
              this.setState({ userPatterns: this.state.userPatterns.filter((p: PatternData) => p.id !== id) })
              console.log("user pattern was removed", change)
              break
            case "modified":
              const patterns = [...this.state.userPatterns]
              let changedPattern = patterns.find(pat => pat.id === id)
              if (changedPattern) {
                changedPattern = { ...changedPattern, ...data}
              }
              this.setState({ userPatterns: patterns })
              console.log("user pattern was modified", change)
          }
        });
    });
  }

  componentDidUpdate(prevProps: { authUser?: firebase.User }) {
    // signed out
    if (prevProps.authUser && !this.props.authUser && this.userPatternsListener) {
      this.setState({ userPatterns: [] })
      this.userPatternsListener()
      this.userPatternsListener = undefined
    }

    // signed in
    if (!prevProps.authUser && this.props.authUser && !this.userPatternsListener) {
      this.subscribeToUserPatterns()
    }
  }

  componentDidMount() {
    this.subscribeToCommunityPatterns()

    if (this.props.authUser) {
      this.subscribeToUserPatterns()
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
    {(state: IPatternsState) => <Component userPatterns={state.userPatterns} communityPatterns={state.communityPatterns} {...props} />}
  </PatternsConsumer>
);