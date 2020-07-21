import React from 'react';
import { compose } from 'recompose';
import { WithAuthProps } from '../Session';
import { withPatterns, WithPatternsProps } from "./../Patterns/context"
import LandingPage from "./../Landing"
import UserPatterns from "../UserPatterns"

type PatternsPageProps = WithAuthProps & WithPatternsProps & { location: any }

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const PatternsPage = React.memo((props: PatternsPageProps) => {
  console.log("Patterns Page", props)
  const { communityPatterns, userPatterns } = props

  if (props.location.pathname === "/") {
    return <LandingPage patterns={communityPatterns} />
  } else if (props.location.pathname === "/my-patterns") {
    return <UserPatterns patterns={userPatterns} />
  } else {
    return <></>
  }
})

export default compose<PatternsPageProps, any>(withPatterns)(PatternsPage);
