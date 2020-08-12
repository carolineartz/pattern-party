import React from 'react';
import firebase from "../components/Firebase"
import { useSetDraft, OwnerType } from '../store';
import uniqBy from "lodash.uniqby"

type LoadPatternsProps = {
  firebase: firebase
  owner: OwnerType
  user?: firebase.User
}

export const useLoadPatterns = ({firebase, user, owner}: LoadPatternsProps) => {
  const setDraft = useSetDraft();

  return React.useCallback(
    async (cursor: firebase.firestore.QueryDocumentSnapshot<PatternType>): Promise<LoadMoreData<PatternType>> => {
      const query = owner === "user" && user ? firebase.userPatterns(user.uid).startAfter(cursor).limit(16) : firebase.patterns().startAfter(cursor).limit(16)
      const snapshots = await query.get()

      const docs = snapshots.docs;
      const nextLastVisible = docs[docs.length - 1];
      const noMore = nextLastVisible === cursor || docs.length < 16

      switch (owner) {
        case "community":
          setDraft((draft) => {
            draft.fetchPatterns.community.hasMore = !noMore
            draft.fetchPatterns.community.startAfter = nextLastVisible;
            draft.communityPatterns = uniqBy([
              ...draft.communityPatterns,
              ...docs.map((doc) => doc.data()),
            ], 'id')
          })
          break
        case "user":
          setDraft((draft) => {
            draft.fetchPatterns.user.hasMore = !noMore
            draft.fetchPatterns.user.startAfter = nextLastVisible;
            draft.userPatterns = uniqBy([
              ...draft.userPatterns,
              ...docs.map((doc) => doc.data()),
            ], 'id')
          });
      }

      return [nextLastVisible, !noMore]
    },
    [setDraft, firebase, user, owner]
  )
};
