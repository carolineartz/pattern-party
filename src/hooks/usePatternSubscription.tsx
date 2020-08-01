import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft } from '../store';

const LIMIT = 10

export const usePatternSubscription = (firebase: Firebase) => {
  const setDraft = useSetDraft();

  React.useEffect(() => {
    let featuredUnsubscribe: firebase.Unsubscribe
    let communityUnsubscribe: firebase.Unsubscribe

    communityUnsubscribe = firebase.patterns().onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          setDraft(draft => {
            draft.communityPatterns = [change.doc.data(), ...draft.communityPatterns]
          })
        }
      })
    })

    featuredUnsubscribe = firebase.featuredPatterns().onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          setDraft(draft => {
            draft.featuredPatterns = [change.doc.data(), ...draft.featuredPatterns]
          })
        } else if (change.type === "removed") {
          setDraft(draft => {
            draft.featuredPatterns = draft.featuredPatterns.filter(pat => pat.id !== change.doc.id)
          })
        }
      })
    })

    return () => {
      if (featuredUnsubscribe) {
        featuredUnsubscribe()
      }
      if (communityUnsubscribe) {
        communityUnsubscribe()
      }
    }
  }, [])
};

export const useUserPatternSubscription = (firebase: Firebase, user?: firebase.User) => {
  const setDraft = useSetDraft();

  React.useEffect(() => {
    let unsubscribe: firebase.Unsubscribe
    if (user) {
      unsubscribe = firebase.userPatterns(user.uid).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            // console.log("added", change.doc.data())
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
