import { useState } from 'react';
import firebase from "firebase"
import Firebase from "./components/Firebase"

export type VisibilityFilterType =
  | 'SHOW_USER'
  | 'SHOW_COMMUNITY'
  | 'SHOW_FEATURED';

type OwnerType = 'user' | 'community'
type PatternId = [string, OwnerType]

export type PatternType = {
  id: string
  markup: string
  featured: boolean
  hidden: boolean
}

export type State = {
  patterns: Map<PatternId, PatternType>
  visibilityFilter: VisibilityFilterType
  authUser: firebase.User | null
  firebase: Firebase | null
  loading : boolean
  error: Error | null
}

const initialState: State = {
  patterns: new Map<PatternId, PatternType>(),
  visibilityFilter: "SHOW_COMMUNITY",
  authUser: null,
  firebase: null,
  loading: false,
  error: null
}

export const useValue = () => useState(initialState);
export type SetState = ReturnType<typeof useValue>[1];
