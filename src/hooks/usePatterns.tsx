import React from 'react';
import Firebase, { LIMIT } from "./../components/Firebase"
import { useSetDraft } from '../store';

export const useUserPatterns = (firebase: Firebase, user?: firebase.User) => {
  const setDraft = useSetDraft();

  return React.useCallback(
    async (hasMore: boolean, lastVisible?: firebase.firestore.QueryDocumentSnapshot<PatternType>) => {
      if (hasMore && user) {
        const snapshots = lastVisible ? await firebase.userPatterns(user.uid).startAfter(lastVisible).get() : await firebase.userPatterns(user.uid).get()
        const docs = snapshots.docs
        const nextLastVisible = docs[docs.length - 1];

        setDraft((draft) => {
          draft.fetchPatterns.user.hasMore = !(lastVisible === nextLastVisible || docs.length < LIMIT)
          draft.fetchPatterns.user.startAfter = nextLastVisible
          draft.userPatterns = [...draft.userPatterns, ...docs.map(doc => doc.data())]
        })
      } else {
        console.log("NO MORE!")
      }
    },
    [setDraft, firebase, user]
  )
};


export const useCommunityPatterns = (firebase: Firebase) => {
  const setDraft = useSetDraft();

  return React.useCallback(
    async (hasMore: boolean, lastVisible?: firebase.firestore.QueryDocumentSnapshot<PatternType>) => {
      if (hasMore) {
        const snapshots = lastVisible ? await firebase.patterns().startAfter(lastVisible).get() : await firebase.patterns().get()
        const docs = snapshots.docs
        const nextLastVisible = docs[docs.length - 1];

        setDraft((draft) => {
          draft.fetchPatterns.community.hasMore = !(lastVisible === nextLastVisible || docs.length < LIMIT)
          draft.fetchPatterns.community.startAfter = nextLastVisible
          draft.communityPatterns = [...draft.communityPatterns, ...docs.map(doc => doc.data())]
        })
      } else {
        console.log("NO MORE!")
      }
    },
    [setDraft, firebase]
  )
};
