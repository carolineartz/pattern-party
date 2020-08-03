import * as React from "react"
import "styled-components/macro"
import { compose } from "recompose";
import { WithRouterProps, WithAuthProps, withAuthentication } from "./Session"
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps } from "grommet"
import { ReactComponent as Logo } from "./../images/logo-confetti.svg"
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../constants/routes"

type HeaderProps = WithAuthProps & WithFirebaseProps & WithRouterProps & {
  onClickSignIn: Function
  onClickSignOut: Function
  onClickCreate: Function
}

const Header = ({ history, onClickSignIn, onClickSignOut, authUser, onClickCreate, firebase }: HeaderProps): JSX.Element => {
  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Box
        direction="row"
        pad={{left: "small"}}
        onClick={() => {
          if (history.location.pathname !== ROUTES.LANDING) {
            history.push(ROUTES.LANDING)
          }
        }}
        align="center"
        gap="xsmall"
      >
        <Box height="100%" css="max-height: 73px; width: 100%; max-width: 73px; padding: 8px 8px 8px 6px;"><Logo /></Box>
        <Box width="small"><Text>Pattern Party!</Text></Box>
      </Box>

      <Box direction="row" gap="medium">
        {authUser && <NavButton
          onClick={() => {
            onClickCreate()
          }}
          text="Generate"
        />}
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
            <Menu
              label={<Avatar background="brand"><Text color="white">{(authUser.displayName || "?").charAt(0)}</Text></Avatar>}
              items={[
                {
                  label: "My Patterns",
                  onClick: () => {
                    if (history.location.pathname !== ROUTES.MY_PATTERNS) {
                      history.push(ROUTES.MY_PATTERNS)
                    }
                  }
                },
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
            css="padding-right: 20px;"
          />
        }
      </Box>
    </GHeader>
  )
}


type NavButtonProps = ButtonProps & {
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void
  text: string
  css?: string
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
