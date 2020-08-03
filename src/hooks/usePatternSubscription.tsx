import React from 'react';
import Firebase, {patternConverter} from "./../components/Firebase"
import { useSetDraft, useTrackedState } from '../store';

const LIMIT = 10

type SubscriptionStatus = "not-subscribed" | "subscribing" | "subscribed"

export const usePatternSubscription = (firebase: Firebase) => {
  const [subscriptionStatus, setSubscriptionStatus] = React.useState<SubscriptionStatus>("not-subscribed")
  const setDraft = useSetDraft();
  const [initialPattern, setInitialPattern] = React.useState<PatternType | undefined>()

  const foo = useTrackedState()
  const { communityPatterns } = foo

  React.useEffect(() => {
    let communityUnsubscribe: firebase.Unsubscribe

    if (initialPattern || communityPatterns.length) {
      setSubscriptionStatus("subscribed")
    }

    else if (subscriptionStatus === "not-subscribed") {
      communityUnsubscribe = firebase.db.collection("patterns").orderBy("createdAt", "desc").withConverter(patternConverter).limit(2).onSnapshot(snapshot => {
        setSubscriptionStatus("subscribing")
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            console.log("**********************************ADDED!", change.doc.data())
            setInitialPattern(change.doc.data())
            setDraft(draft => {
              draft.communityPatterns = [change.doc.data(), ...draft.communityPatterns]
            })
          }
        })
      })
    }

    return () => {
      // if (communityUnsubscribe) {
      //   console.log("unsubscribing")
      //   communityUnsubscribe()
      // }
    }
  }, [initialPattern, subscriptionStatus, communityPatterns.length, firebase, setDraft])

  console.log(subscriptionStatus, communityPatterns)
  console.log("initial pattern", initialPattern)
  return subscriptionStatus
};

export const useUserPatternSubscription = (firebase: Firebase, user?: firebase.User) => {
  const setDraft = useSetDraft();

  React.useEffect(() => {
    let unsubscribe: firebase.Unsubscribe
    if (user) {
      unsubscribe = firebase.userPatterns(user.uid).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            setDraft(draft => {
              draft.userPatterns = [change.doc.data(), ...draft.userPatterns]
            })
          }
        })
      })
    }
    return (() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })
  }, [user])
};
