import React from 'react';
import { compose } from 'recompose';
import { WithAuthProps, withAuthentication } from '../Session';
import { withPatterns, WithPatternsProps } from "./../Patterns/context"
import LandingPage from "./../Landing"
import ExplorePage from "./../Explore"

type HomePageProps = WithAuthProps & WithPatternsProps & { location: any }

type PatternData = {
  id: string
  markup: string
  hidden?: boolean
}

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const HomePage = (props: HomePageProps) => {
  console.log(props)
  const { authUser, communityPatterns, userPatterns } = props

  if (props.location.pathname === "/") {
    return <LandingPage patterns={authUser ? userPatterns : communityPatterns} />
  } else if (props.location.pathname === "/explore") {
    return <ExplorePage patterns={communityPatterns} />
  } else {
    return <></>
  }
}

export default compose<HomePageProps, any>(withAuthentication, withPatterns)(HomePage);
