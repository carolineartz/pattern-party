import React from 'react';
import { compose } from 'recompose';
import { WithAuthProps } from '../Session';
import { withPatterns, WithPatternsProps } from "./../Patterns/context"
import LandingPage from "./../Landing"
import UserPatterns from "../UserPatterns"
import "styled-components/macro"

type PatternsPageProps = WithAuthProps & WithPatternsProps & { location: any }

type LoadingState = "not-started" | "loading" | "loaded" | "error"

const PatternsPage = React.memo((props: PatternsPageProps) => {
  console.log("Patterns Page", props)
  const { communityPatterns, userPatterns } = props
  return (
    <>
      {props.location.pathname === "/"&& <LandingPage patterns={communityPatterns} />}
      {props.location.pathname === "/my-patterns" && <UserPatterns patterns={userPatterns} />}
    </>
  )
})

export default compose<PatternsPageProps, any>(withPatterns)(PatternsPage);
