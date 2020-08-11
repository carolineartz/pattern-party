import * as React from "react"
import "styled-components/macro"
// import { compose } from "recompose";
// import { WithAuthProps, withAuthentication } from "./Session"
import { withFirebase, WithFirebaseProps } from "./Firebase"
import { Header as GHeader, Box, Text, Menu, Button, Avatar, ButtonProps, ResponsiveContext } from "grommet"
import { Confetti } from "./Icon"
import { withRouter,RouteComponentProps } from 'react-router-dom';
import {useSetDraft} from "./../store"
import { WithRouterProps } from "./Session"

import * as ROUTES from "../constants/routes"

type AuthHeaderProps = WithFirebaseProps & RouteComponentProps & {
  authUser: firebase.User
  onClickSignOut: Function
  onClickCreate: Function
  onClickShowIntro: Function
}

const AuthHeaderComponent = ({ authUser, firebase, history, onClickSignOut, onClickShowIntro: handleClickShowIntro, onClickCreate: handleClickCreate }: AuthHeaderProps) => {
  const size = React.useContext(ResponsiveContext)
  const sizeIsSmall = size === "small"
  const setDraft = useSetDraft()

  const handleClickSignout = (_evt: React.MouseEvent) => {
    firebase.doSignOut().then(() => {
      onClickSignOut()
      setDraft(draft => {
        draft.userPatterns = []
        draft.fetchPatterns.user = { hasMore: true }
      })
      history.push(ROUTES.LANDING)
    })
  }

  const handleClickExplore = () => {
    if (history.location.pathname !== ROUTES.EXPLORE) {
      history.push(ROUTES.EXPLORE)
    }
  }

  const handleClickMyPatterns = () => {
    if (history.location.pathname !== ROUTES.MY_PATTERNS) {
      history.push(ROUTES.MY_PATTERNS)
    }
  }

  const nonMobileNav = (
    <Box direction="row" gap="large">
      <NavButton onClick={() => handleClickCreate()} text="Create" />
      <NavButton
        active={history.location.pathname === ROUTES.EXPLORE}
        onClick={handleClickExplore}
        text="Explore"
      />
      <NavButton
        active={history.location.pathname === ROUTES.MY_PATTERNS}
        onClick={handleClickMyPatterns}
        text="My Patterns"
      />
      <Menu
        label={<Avatar background="brand"><Text color="white">{(authUser!.displayName || "?").charAt(0)}</Text></Avatar>}
        justifyContent="end"
        items={[
          {
            label: <LabelText text="Show Intro" />,
            onClick: handleClickShowIntro
          },
          {
            label: <LabelText text='Sign Out' />,
            onClick: handleClickSignout
          },
        ]}
      />
    </Box>
  )

  const mobileNav = (
    <Menu
      label={<Avatar background="brand"><Text color="white">{((authUser && authUser.displayName) || "?").charAt(0)}</Text></Avatar>}
      justifyContent="end"
      items={[
        {
          label: <LabelText text="My Patterns" />,
          onClick: handleClickMyPatterns
        },
        {
          label: <LabelText text="Explore" />,
          onClick: handleClickExplore
        },
        {
          label: <LabelText text="Create" />,
          onClick: handleClickCreate
        },
        {
          label: <LabelText text="Show Intro" />,
          onClick: handleClickShowIntro
        },
        {
          label: <LabelText text='Sign Out' />,
          onClick: handleClickSignout
        },
      ]}
    />
  )

  return (
    <Header>
      {!sizeIsSmall || !authUser ? nonMobileNav : mobileNav}
    </Header>
  )
}

export const AuthHeader = withRouter(withFirebase(AuthHeaderComponent))

type PublicHeaderProps = RouteComponentProps & {
  onClickSignIn: Function
}

const PublicHeaderComponent = ({ history, onClickSignIn: handleClickSignIn }: PublicHeaderProps): JSX.Element => {
  const handleClickExplore = () => {
    if (history.location.pathname !== ROUTES.EXPLORE) {
      history.push(ROUTES.EXPLORE)
    }
  }

  return (
    <Header>
      <Box />
      <Box direction="row" gap="medium">
      <NavButton
        active={history.location.pathname === ROUTES.EXPLORE}
        onClick={handleClickExplore}
        text="Explore"
      />
      <NavButton
          onClick={() => {
            // debugger
          handleClickSignIn()
        }}
        text="Sign In"
        css="padding-right: 20px;"
        />
      </Box>
    </Header>
  )
}

export const PublicHeader = withRouter(PublicHeaderComponent)

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

const LabelText = ({ text }: { text: string }) => (
  <Box pad={{ horizontal: "medium", vertical: "small" }}>{text}</Box>
)

const Header = withRouter(({ children, history }: WithRouterProps) => {
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
        {children}
    </GHeader>
  )
})
