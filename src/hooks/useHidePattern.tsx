import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft, OwnerType, useTrackedState } from '../store';

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
  const state = useTrackedState()
  const userIsAdmin = user && (user as any).roles && (user as any).roles.admin

  return React.useCallback(
    (patternId) => {
      if (owner === "community" && userIsAdmin) {
        const patternForHide = state.communityPatterns.find(pattern => pattern.id === patternId)
        if (patternForHide) {
          firebase.pattern(patternId).set({...patternForHide, ...{ hidden: true }})
        }
        setDraft(draft => {
          const hiddenPattern = draft.communityPatterns.find(pattern => pattern.id === patternId)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      }

      else if (owner === "user" && user) {
        const patternForHide = state.userPatterns.find(pattern => pattern.id === patternId)
        if (patternForHide) {
          firebase.userPattern(user.uid, patternId).set({...patternForHide, ...{ hidden: true }})
        }
        setDraft(draft => {
          const hiddenPattern = draft.userPatterns.find(pattern => pattern.id === patternId)
          hiddenPattern && (hiddenPattern.hidden = true)
        })
      }
    },
    [setDraft, firebase, user, owner, userIsAdmin],
  );
};
