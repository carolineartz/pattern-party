import React from 'react';
import { WithAuthProps } from '../Session'
import ExplorePage from "./../Explore"
import { compose } from 'recompose';
import { withRouter } from "react-router-dom"
import * as ROUTES from '../../constants/routes';
import { auth } from 'firebase';

type LandingPageProps = WithAuthProps & {
  history: any
}

const LandingPage = ({ authUser, history }: LandingPageProps) => {
  React.useEffect(() => {
    if (authUser) {
      history.push(ROUTES.HOME)
    }
  }, [authUser, history])

  console.log(authUser)

  return (
    <ExplorePage authUser={authUser} />
  )
}


export default compose<LandingPageProps, any>(withRouter)(LandingPage);
