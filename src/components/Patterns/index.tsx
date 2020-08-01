import React from 'react';
import { compose } from 'recompose';
import "styled-components/macro"

import { WithAuthProps } from '../Session';
import LandingPage from "../LandingPage"
import UserPatternsPage from "../UserPatternsPage"
import { withPatterns, IPatternsState } from "./context"
import { PatternList } from "./patternList"
import { PatternGrid } from "./grid"
import { CreatePattern } from './createFrame'
import { DestroyPatternDialog } from "./destroyDialog"


type PatternsPageProps = WithAuthProps & WithPatternsProps & { location: any }


const PatternsPage = React.memo((props: PatternsPageProps) => {
  console.log("Patterns Page", props)
  const { communityPatterns, userPatterns } = props
  return (
    <>
      {props.location.pathname === "/"&& <LandingPage patterns={communityPatterns} />}
      {props.location.pathname === "/my-patterns" && <UserPatternsPage patterns={userPatterns} />}
    </>
  )
})

export default compose<PatternsPageProps, any>(withPatterns)(PatternsPage);
export type WithPatternsProps = IPatternsState
export {
  withPatterns, PatternList, PatternGrid, CreatePattern, DestroyPatternDialog
}
