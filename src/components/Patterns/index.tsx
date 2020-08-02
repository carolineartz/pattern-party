import React from 'react';
import { compose } from 'recompose';
import "styled-components/macro"

// import { WithAuthProps } from '../Session';
// import LandingPage from "../LandingPage"
// import UserPatternsPage from "../UserPatterns"
// import { withPatterns, IPatternsState } from "./context"
import { PatternList } from "./patternList"
import { PatternGrid } from "./grid"
import { CreatePattern } from './createFrame'
import { DestroyPatternDialog } from "./destroyDialog"


// export type WithPatternsProps = IPatternsState
export {
  PatternList, PatternGrid, CreatePattern, DestroyPatternDialog
}
