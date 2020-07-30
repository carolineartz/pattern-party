import * as React from "react"
import "styled-components/macro"

import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps } from "grommet"
import { ReactComponent as Logo } from "./../images/logo-with-text-white-outline.svg"
import { withRouter } from 'react-router-dom';
// import { WithRouterProps } from "./Session"

import * as ROUTES from "../constants/routes"
import { useDispatch, useTrackedState } from './../state';

type HeaderProps = {
  history: any
  children: React.ReactNode
  onClickSignIn: Function
  onClickSignOut: Function
}

const Header = ({ history, onClickSignIn, onClickSignOut, children }: HeaderProps): JSX.Element => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Box direction="row" responsive pad="xsmall" justify="center" align="center" onClick={() => {
        if (history.location.pathname !== ROUTES.LANDING) {
          history.push(ROUTES.LANDING)
        }
      }}>
        <Box height={{ max: "52px" }}><Logo /></Box>
      </Box>
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
        {state.authUser &&
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
              label={<Avatar background="brand"><Text color="white">{(state.authUser.displayName || "?").charAt(0)}</Text></Avatar>}
              items={[
                {
                  label: 'Sign Out',
                  onClick: () => {
                    onClickSignOut()
                    dispatch({type: "LOGOUT_USER"})
                  }
                },
              ]}
            />
          </>
        }
        {!state.authUser &&
          <NavButton
            onClick={() => {
              onClickSignIn()
              // dispatch({ type: "LOGIN_USER" })
            }}
            text="Sign In"
          />
        }
      </Box>
    </GHeader>
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

// const Foo = withRouter(Header)

export default withRouter<any, any>(Header)
