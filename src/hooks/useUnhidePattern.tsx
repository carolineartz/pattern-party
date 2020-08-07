import React from 'react';
import Firebase from "../components/Firebase"
import { useSetDraft, OwnerType } from '../store';

type UnhidePatternProps = {
  firebase: Firebase
  owner: OwnerType
  user?: firebase.User
}

export const useUnhidePattern = ({
  firebase,
  user,
  owner
}: UnhidePatternProps) => {
  const setDraft = useSetDraft();
  const userIsAdmin = user && (user as any).roles && (user as any).roles.admin

  return React.useCallback(
    (pattern: PatternType) => {
      if (owner === "community" && userIsAdmin) {
        firebase.pattern(pattern.id).set({...pattern, ...{ hidden: false, featured: Boolean(pattern.featured) }})
        setDraft(draft => {
          const hiddenPattern = draft.communityPatterns.find(pat => pat.id === pattern.id)
          hiddenPattern && (hiddenPattern.hidden = false)
        })
      }

      else if (owner === "user" && user) {
        firebase.userPattern(user.uid, pattern.id).set({...pattern, ...{ hidden: false, featured: Boolean(pattern.featured) }})
        setDraft(draft => {
          const hiddenPattern = draft.userPatterns.find(pat => pat.id === pattern.id)
          hiddenPattern && (hiddenPattern.hidden = false)
        })
      }
    },
    [setDraft, firebase, user, owner, userIsAdmin],
  );
};
