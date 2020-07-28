import * as React from "react"
import "styled-components/macro"

import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps } from "grommet"
import { ReactComponent as Logo } from "./../../images/logo-with-text-white-outline.svg"
import { withRouter } from 'react-router-dom';
import { WithRouterProps, WithAuthProps, withAuthentication } from "./Session"
import { withFirebase, WithFirebaseProps } from "./Firebase"

import * as ROUTES from "../constants/routes"
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
      <Box direction="row" gap="medium" pad={{ right: "medium" }}>
        <NavButton
          active={history.location.pathname === ROUTES.EXPLORE}
          onClick={() => {
            if (history.location.pathname !== ROUTES.EXPLORE) {
              history.push(ROUTES.EXPLORE)
            }
          }}
          text="Explore"
        />
        {authUser &&
          <>
            <NavButton
              active={history.location.pathname === ROUTES.MY_PATTERNS}
              onClick={() => {
                if (history.location.pathname !== ROUTES.MY_PATTERNS) {
                  history.push(ROUTES.MY_PATTERNS)
                }
              }}
              text="My Patterns"
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
          <NavButton
            onClick={() => onClickSignIn()}
            text="Sign In"
          />
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

type NavButtonProps = ButtonProps & {
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void
  text: string
}

const NavButton = ({text, active, ...restProps}: NavButtonProps) => {
  return (
    <Button
      plain
      label={
        <Box
          css={`
            border-bottom: 3px solid;
            border-bottom-width: ${active ? '3px' : '0'}
          `}>
          {text}
        </Box>
      }
      {...restProps}
    />
  )
}

export default compose<HeaderProps, any>(withRouter, withFirebase, withAuthentication)(Header);
