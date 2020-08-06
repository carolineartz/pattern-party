import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft, OwnerType } from '../store';

type HidePatternProps = {
  firebase: Firebase
  owner: OwnerType
  user?: firebase.User
}

export const useHidePattern = ({
  firebase,
  user,
  owner
}: HidePatternProps) => {
  const setDraft = useSetDraft();
  const userIsAdmin = user && (user as any).roles && (user as any).roles.admin

  return React.useCallback(
    (patternId) => {
      if (owner === "community" && userIsAdmin) {
        firebase.pattern(patternId).set({hidden: true}, {merge: true})
        setDraft(draft => {
          const hiddenPattern = draft.communityPatterns.find(pattern => pattern.id === patternId)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      } else if (owner === "user" && user) {
        firebase.userPattern(user.uid, patternId).set({hidden: true}, {merge: true})
        setDraft(draft => {
          const hiddenPattern = draft.userPatterns.find(pattern => pattern.id === patternId)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      }
    },
    [setDraft, firebase, user, owner, userIsAdmin],
  );
};
