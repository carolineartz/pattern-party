import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft } from '../store';
import { firestore } from "firebase"

function generateLocalId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
};

export const useCreatePattern = (firebase: Firebase, user: firebase.User) => {
  const setDraft = useSetDraft();

  return React.useCallback(
    (markup) => {
      const data = {
        featured: false,
        hidden: false,
        markup,
        createdAt: firestore.Timestamp.now()
      }
      firebase.patternCollection().add(data)
      firebase.userPatternCollection(user.uid).add(data)

      setDraft((draft) => {
        draft.userPatterns = [{id: generateLocalId(), ...data}, ...draft.userPatterns]
      })
    },
    [setDraft, firebase, user],
  );
};
