import * as React from "react"
import "styled-components/macro"
import { compose } from "recompose";
import { WithRouterProps, WithAuthProps, withAuthentication } from "./Session"
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps, ResponsiveContext } from "grommet"
import { Confetti } from "./Icon"
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../constants/routes"

type HeaderProps = WithAuthProps & WithFirebaseProps & WithRouterProps & {
  onClickSignIn: Function
  onClickSignOut: Function
  onClickCreate: Function
  onClickShowIntro: Function
}

const Header = ({ history, onClickSignIn, onClickSignOut, authUser, onClickCreate, firebase, onClickShowIntro }: HeaderProps): JSX.Element => {
  const size = React.useContext(ResponsiveContext)
  const sizeIsSmall = size === "small"

  const onClickExplore = () => {
    if (history.location.pathname !== ROUTES.EXPLORE) {
      history.push(ROUTES.EXPLORE)
    }
  }

  const onClickMyPatterns = () => {
    if (history.location.pathname !== ROUTES.MY_PATTERNS) {
      history.push(ROUTES.MY_PATTERNS)
    }
  }

  const nonMobileNav = (
    <Box direction="row" gap="large">
      {authUser && <NavButton onClick={() => { onClickCreate() }} text="Create" />}
      <NavButton
        active={history.location.pathname === ROUTES.EXPLORE}
        onClick={onClickExplore}
        text="Explore"
      />
      {authUser &&
        <NavButton
          active={history.location.pathname === ROUTES.MY_PATTERNS}
          onClick={onClickMyPatterns}
          text="My Patterns"
        />}
      {!authUser &&
        <NavButton
          onClick={() => onClickSignIn()}
          text="Sign In"
          css="padding-right: 20px;"
        />}
      {authUser &&
        <Menu
          label={<Avatar background="brand"><Text color="white">{(authUser.displayName || "?").charAt(0)}</Text></Avatar>}
          items={[
            {
              label: "Show Intro",
              onClick: onClickShowIntro
            },
            {
              label: 'Sign Out',
              onClick: () => {
                onClickSignOut()
                firebase.doSignOut()
              }
            },
          ]}
        />}
    </Box>
  )

  const authMobileMenu = (
    <Menu
      label={<Avatar background="brand"><Text color="white">{((authUser && authUser.displayName) || "?").charAt(0)}</Text></Avatar>}
      items={[
        {
          label: "My Patterns",
          onClick: onClickMyPatterns
        },
        {
          label: "Explore",
          onClick: onClickExplore
        },
        {
          label: "Create",
          onClick: onClickCreate
        },
        {
          label: "Show Intro",
          onClick: onClickShowIntro
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
  )

  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Box
        direction="row"
        pad={{left: "medium", vertical: "small"}}
        onClick={() => {
          if (history.location.pathname !== ROUTES.LANDING) {
            history.push(ROUTES.LANDING)
          }
        }}
        align="center"
        gap="small"
      >
        <Confetti size="large" color="plain" />
        <Box width="small"><Text>Pattern Party!</Text></Box>
      </Box>
        {!sizeIsSmall || !authUser ? nonMobileNav : authMobileMenu}
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
      size="small"
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
    // <Box direction="row" gap="large">
    //     {!sizeIsSmall && nonMobileNav }
    //     {authUser &&
    //       <>
    //         <Menu
    //           label={<Avatar background="brand"><Text color="white">{(authUser.displayName || "?").charAt(0)}</Text></Avatar>}
    //           items={[
    //             {
    //               label: "Show Intro",
    //               onClick: onClickShowIntro
    //             },
    //             {
    //               label: 'Sign Out',
    //               onClick: () => {
    //                 onClickSignOut()
    //                 firebase.doSignOut()
    //               }
    //             },
    //           ]}
    //         />
    //       </>
    //     }
    //     {!authUser &&
          // <NavButton
          //   onClick={() => onClickSignIn()}
          //   text="Sign In"
          //   css="padding-right: 20px;"
          // />
    //     }
    //   </Box>

        // {authUser && <NavButton onClick={() => { onClickCreate() }} text="Create"/>}
        // <NavButton
        //   active={history.location.pathname === ROUTES.EXPLORE}
        //   onClick={() => {
        //     if (history.location.pathname !== ROUTES.EXPLORE) {
        //       history.push(ROUTES.EXPLORE)
        //     }
        //   }}
        //   text="Explore"
        // />
        // <NavButton
        //   active={history.location.pathname === ROUTES.MY_PATTERNS}
        //   onClick={() => {
        //     if (history.location.pathname !== ROUTES.MY_PATTERNS) {
        //       history.push(ROUTES.MY_PATTERNS)
        //     }
        //   }}
        //   text="My Patterns"
        // />
