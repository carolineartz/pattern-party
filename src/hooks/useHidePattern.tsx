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
    (pattern: PatternType) => {
      if (owner === "community" && userIsAdmin) {
        firebase.pattern(pattern.id).set({...pattern, ...{ hidden: true, featured: Boolean(pattern.featured) }})
        setDraft(draft => {
          const hiddenPattern = draft.communityPatterns.find(pat => pat.id === pattern.id)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      }

      else if (owner === "user" && user) {
        firebase.userPattern(user.uid, pattern.id).set({...pattern, ...{ hidden: true, featured: Boolean(pattern.featured) }})
        setDraft(draft => {
          const hiddenPattern = draft.userPatterns.find(pat => pat.id === pattern.id)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      }
    },
    [setDraft, firebase, user, owner, userIsAdmin],
  );
};
