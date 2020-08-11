import * as React from "react"
import "styled-components/macro"
import { compose } from "recompose";
import { WithRouterProps, WithAuthProps, withAuthentication } from "./Session"
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps, ResponsiveContext } from "grommet"
import { Confetti } from "./Icon"
import { withRouter } from 'react-router-dom';
import {useSetDraft} from "./../store"

import * as ROUTES from "../constants/routes"

type HeaderProps = WithAuthProps & WithFirebaseProps & WithRouterProps & {
  onClickSignIn: Function
  onClickSignOut: Function
  onClickCreate: Function
  onClickShowIntro: Function
}

const Header = ({ history, onClickSignIn, onClickSignOut, authUser, onClickCreate, firebase, onClickShowIntro }: HeaderProps): JSX.Element => {
  const size = React.useContext(ResponsiveContext)
  const isSmall = size === "small"
  const setDraft = useSetDraft()

  const onClickedSignout = (_evt: React.MouseEvent) => {
    firebase.doSignOut().then(() => {
      onClickSignOut()
      setDraft(draft => {
        draft.userPatterns = []
        if (draft.subscriptions.user) {
          draft.subscriptions.user()
        }
        draft.fetchPatterns.user = { hasMore: true }
      })
      history.push(ROUTES.LANDING)
    })
  }

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
    <Box direction="row" gap={isSmall ? "small" : "large"}>
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
          justifyContent="end"
          items={[
            {
              label: <LabelText text="Show Intro" />,
              onClick: onClickShowIntro
            },
            {
              label: <LabelText text='Sign Out' />,
              onClick: onClickedSignout
            },
          ]}
        />}
    </Box>
  )

  const authMobileMenu = (
    <Menu
      label={
        <Box pad={{horizontal: isSmall ? "medium" : undefined}}><Avatar background="brand"><Text color="white">{((authUser && authUser.displayName) || "?").charAt(0)}</Text></Avatar></Box>
      }
      justifyContent="end"
      items={[
        {
          label: <LabelText text="My Patterns" />,
          onClick: onClickMyPatterns
        },
        {
          label: <LabelText text="Explore" />,
          onClick: onClickExplore
        },
        {
          label: <LabelText text="Create" />,
          onClick: onClickCreate
        },
        {
          label: <LabelText text="Show Intro" />,
          onClick: onClickShowIntro
        },
        {
          label: <LabelText text='Sign Out' />,
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
        <Box width={{ max: "small" }}><Text>Pattern Party!</Text></Box>
      </Box>
        {!isSmall || !authUser ? nonMobileNav : authMobileMenu}
    </GHeader>
  )
}


type NavButtonProps = ButtonProps & {
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void
  text: string
  css?: string
}

const NavButton = ({ text, active, ...restProps }: NavButtonProps) => {
  const size = React.useContext(ResponsiveContext)
  const isSmall = size === "small"
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
          <Text size={isSmall ? "small" : "medium"}>{text}</Text>
        </Box>
      }
      {...restProps}
    />
  )
}

const LabelText = ({ text }: { text: string }) => (
  <Box pad={{ horizontal: "small", vertical: "small" }}>{text}</Box>
)

export default compose<HeaderProps, any>(withRouter, withFirebase, withAuthentication)(Header);
