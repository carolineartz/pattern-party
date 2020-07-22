import * as React from "react"
import "styled-components/macro"

import { Header as GHeader, Box, Text, Anchor, Menu, Button, Avatar } from "grommet"
import { ReactComponent as Logo } from "./../../images/logo-with-text-white-outline.svg"
import { withRouter } from 'react-router-dom';
import { WithRouterProps, WithAuthProps, withAuthentication } from "./../Session"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { Add } from "grommet-icons"

import * as ROUTES from "./../../constants/routes"
import { compose } from "recompose";

type HeaderProps = WithRouterProps & WithAuthProps & WithFirebaseProps & {
  onClickSignIn: Function
  onClickSignOut: Function
  onClickCreate: Function
}

const Header = ({history, authUser, firebase, onClickSignIn, onClickSignOut, onClickCreate}: HeaderProps) => {
  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Brand history={history}>
        <Box height={{ max: "52px" }}><Logo /></Box>
      </Brand>
      <Box direction="row" gap="small" pad={{ right: "medium" }}>
        {authUser &&
          <>
          <Button icon={<Add />} onClick={() => onClickCreate()} />
          <Button
            plain
            css={`
              border-bottom: 3px solid;
              border-bottom-width: ${history.location.pathname === ROUTES.MY_PATTERNS ? '3px' : '0'}
            `}
            onClick={() => {
              if (history.location.pathname !== ROUTES.MY_PATTERNS) {
                history.push(ROUTES.MY_PATTERNS)
              }
            }}
            label={<Box>My Patterns</Box>}
            />
            <Menu
              label={<Avatar background="brand"><Text color="white">{(authUser.displayName || "?").charAt(0)}</Text></Avatar>}
              items={[
                {
                  label: 'Sign Out',
                  onClick: () => {
                    onClickSignOut()
                    firebase.doSignOut()
                  }
                },
              ]}
            />
          </>
        }
        {!authUser &&
          <Box>
            <Anchor onClick={() => onClickSignIn()} label="Sign In" />
          </Box>
        }
      </Box>
    </GHeader>
  )
}


const Brand = ({ history, children }: WithRouterProps) => {
  return (
    <Box direction="row" responsive pad="xsmall" justify="center" align="center" onClick={() => {
      if (history.location.pathname !== ROUTES.LANDING) {
        history.push(ROUTES.LANDING)
      }
    }}>{children}
    </Box>
  )
}

type UserIconProps = {
  character: string
}

const UserIcon = ({ character }: UserIconProps) => {
  return (
    <Box background="brand" round align="center" justify="center" height="50px" width="50px">
      <Text color="white">{character}</Text>
    </Box>
  )
}


export default compose<HeaderProps, any>(withRouter, withFirebase, withAuthentication)(Header);

// export default withRouter<WithRouterProps, any>(Header)
