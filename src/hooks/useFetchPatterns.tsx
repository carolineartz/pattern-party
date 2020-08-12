import React from 'react';
import firebase from "../components/Firebase"
import { useSetDraft, OwnerType } from '../store';

type FetchPatternsProps = {
  firebase: firebase
  owner: OwnerType
  user?: firebase.User
}

export const useFetchPatterns = ({firebase, user, owner}: FetchPatternsProps) => {
  const setDraft = useSetDraft();

  return React.useCallback(
    async (startAfter) => {
      if (startAfter) { return }

      if (user && owner === "user") {
        const snapshots = await firebase.userPatterns(user.uid).get()
        const docs = snapshots.docs
        const lastVisible = docs[docs.length - 1];

        setDraft((draft) => {
          draft.fetchPatterns.user.startAfter = lastVisible
          draft.userPatterns = docs.map(doc => doc.data())
        })
      } else {
        const communitySnapshots = await firebase.patterns(16).get()
        const featuredPatterns = await firebase.featuredPatterns().get()
        const docs = communitySnapshots.docs
        const nextLastVisible = docs[docs.length - 1];

        setDraft((draft) => {
          draft.fetchPatterns.community.startAfter = nextLastVisible
          draft.communityPatterns = docs.map(doc => doc.data())
          draft.featuredPatterns = featuredPatterns.docs.map(doc => doc.data())
        })
      }
    },
    [setDraft, firebase, user, owner]
  )
};
