import React from 'react';
import Firebase, {patternConverter} from "./../components/Firebase"
import { useSetDraft, useTrackedState } from '../store';

type SubscriptionStatus = "not-subscribed" | "subscribing" | "subscribed"

export const usePatternSubscription = (firebase: Firebase) => {
  const [subscriptionStatus, setSubscriptionStatus] = React.useState<SubscriptionStatus>("not-subscribed")
  const [initialPattern, setInitialPattern] = React.useState<PatternType | undefined>()

  const setDraft = useSetDraft();
  const { communityPatterns } = useTrackedState()

  React.useEffect(() => {
    if (initialPattern || communityPatterns.length) {
      setSubscriptionStatus("subscribed")
    }

    else if (subscriptionStatus === "not-subscribed") {
      firebase.db.collection("patterns").orderBy("createdAt", "desc").withConverter(patternConverter).limit(2).onSnapshot(snapshot => {
        setSubscriptionStatus("subscribing")
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            setInitialPattern(change.doc.data())
            setDraft(draft => {
              if (!draft.communityPatterns.find(pat => pat.id === change.doc.id)) {
                draft.communityPatterns = [change.doc.data(), ...draft.communityPatterns]
              }
            })
          }
        })
      })
    }
  }, [initialPattern, subscriptionStatus, communityPatterns.length, firebase, setDraft])

  return subscriptionStatus
};
