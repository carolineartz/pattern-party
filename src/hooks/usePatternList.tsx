import { useTrackedState, VisibilityFilterType } from '../store';
import {featuredPatterns, userPatterns, communityPatterns} from "./../util"

export const usePatternList = (filter: VisibilityFilterType) => {
  const state = useTrackedState();

  switch (filter) {
    case 'SHOW_USER':
      return userPatterns(state.patterns)
    case "SHOW_COMMUNITY":
      return communityPatterns(state.patterns)
    case "SHOW_FEATURED":
      return featuredPatterns(state.patterns)
  }
};
