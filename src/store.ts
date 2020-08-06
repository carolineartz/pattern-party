import React from 'react';
import { createContainer } from 'react-tracked';
import produce, { Draft } from 'immer';

export type VisibilityFilterType =
  | 'SHOW_USER'
  | 'SHOW_COMMUNITY'
  | 'SHOW_FEATURED';

export type OwnerType = 'user' | 'community'
export type CollectionType = OwnerType | 'featured'
export type PatternId = [string, OwnerType]

export type PatternType = {
  id: string
  markup: string
  featured: boolean
  hidden: boolean
  createdAt?: firebase.firestore.Timestamp
}

export type State = {
  patterns: Map<PatternId, PatternType>
  communityPatterns: PatternType[],
  featuredPatterns: PatternType[],
  userPatterns: PatternType[],
  subscriptions: {
    user?: firebase.Unsubscribe
    community?: firebase.Unsubscribe
    featured?: firebase.Unsubscribe
  },
  fetchPatterns: {
    community: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    },
    user: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    }
    featured: {
      startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternType>
      hasMore: boolean
    }
  }
  visibilityFilter: VisibilityFilterType
}

const initialState: State = {
  patterns: new Map<PatternId, PatternType>(),
  communityPatterns: [],
  userPatterns: [],
  featuredPatterns: [],
  visibilityFilter: "SHOW_COMMUNITY",
  subscriptions: {},
  fetchPatterns: {
    community: {
      hasMore: true,
      startAfter: undefined
    },
    user: {
      hasMore: true,
      startAfter: undefined
    },
    featured: {
      hasMore: true,
      startAfter: undefined
    }
  }
}
const useValue = () => React.useState(initialState);

const { Provider: PatternProvider, useTrackedState, useUpdate: useSetState } = createContainer(
  useValue
);

const useSetDraft = () => {
  const setState = useSetState();
  return React.useCallback(
    (draftUpdater: (draft: Draft<State>) => void) => {
      setState(produce(draftUpdater));
    },
    [setState]
  );
};

export { PatternProvider, useTrackedState, useSetDraft };
