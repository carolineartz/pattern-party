import * as React from "react"
import "styled-components/macro"

import { Header as GHeader, Box, Text, Anchor } from "grommet"
import { ReactComponent as Logo } from "./../../images/logo-p.svg"
import { withRouter, Link } from 'react-router-dom';
import { WithRouterProps, WithAuthProps, withAuthentication } from "./../Session"
import { withFirebase, WithFirebaseProps } from "./../Firebase"

import * as ROUTES from "./../../constants/routes"
import { compose } from "recompose";

const Header = ({history, authUser, firebase}: WithRouterProps & WithAuthProps & WithFirebaseProps) => {
  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Brand history={history}>
        <Box height={{ max: "52px" }}><Logo /></Box>
        <Text>PatternParty</Text>
      </Brand>
      <Box direction="row" gap="small" pad={{ right: "medium" }}>
        {authUser &&
          <>
          <Box pad={{right: "small"}}>
            <Link to={ROUTES.MY_PATTERNS}>
              <Text color="text" weight="normal">My Patterns</Text>
            </Link>
          </Box>
          <Box>
            <Anchor onClick={firebase.doSignOut} label="Sign Out" />
          </Box>
          </>
        }
        {!authUser &&
          <Box>
            <Link to={ROUTES.SIGN_IN}>
              <Text color="text" weight="normal">Sign in</Text>
            </Link>
          </Box>
        }
      </Box>
    </GHeader>
  )
}


const Brand = ({ history, children }: WithRouterProps) => {
  return (
    <Box direction="row" responsive pad="xsmall" justify="center" align="center" onClick={() => {
      history.push(ROUTES.LANDING)
    }}>{children}
    </Box>
  )
}


export default compose<WithRouterProps & WithAuthProps & WithFirebaseProps, any>(withRouter, withFirebase, withAuthentication)(Header);

// export default withRouter<WithRouterProps, any>(Header)
