import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft, OwnerType } from '../store';
import { firestore } from "firebase"

type DestroyPatternProps = {
  firebase: Firebase
  owner: OwnerType
  user?: firebase.User
}

export const useDestroyPattern = ({
  firebase,
  user,
  owner
}: DestroyPatternProps) => {
  const setDraft = useSetDraft();
  const userIsAdmin = user && (user as any).roles && (user as any).roles.admin

  return React.useCallback(
    (patternId) => {
      if (owner === "community" && userIsAdmin) {
        firebase.pattern(patternId).delete()
        setDraft((draft) => {
          draft.communityPatterns = draft.communityPatterns.filter(pat => pat.id !== patternId)
        })
      } else if (owner === "user" && user) {
        firebase.userPattern(user.uid, patternId).delete()
        setDraft((draft) => {
          draft.userPatterns = draft.userPatterns.filter(pat => pat.id !== patternId)
        })
      }
    },
    [setDraft, firebase, user],
  );
};
