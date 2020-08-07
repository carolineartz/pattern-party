import React from "react"
import "styled-components/macro"

import { Box, ResponsiveContext, Heading, Stack, Button, Text, Anchor, Image, Carousel } from "grommet"
import { Close, Gallery, Code, Save } from "grommet-icons"
import { Pinata, PartyHat } from "./Icon"
import { Tagline } from "./Tagline"
import { ColorType } from "grommet/utils"

type PublicInfoPanelProps = {
  onDismiss: Function
  onClickSignIn: Function
}

export const PublicInfoPanel = ({ onDismiss, onClickSignIn }: PublicInfoPanelProps) => {
  return (
    <InfoPanel
      onDismiss={onDismiss}
      color="#74DEDA"
      headline={<>Welcome to <br /> Pattern Party!</>}
      headlineIcon={Pinata}
    >
      <Text size="large" textAlign="center">
        Pattern Party is a place to share and collect svg patterns made via the wonderful <Anchor color="text" href="https://doodad.dev/pattern-generator" target="_blank" label="DOODAD.DEV" /> pattern generator tool.
      </Text>
      <Box align="center" justify="center" direction="row" gap="medium">
        <InfoIcon icon={Gallery} text="Copy Data URL" />
        <InfoIcon icon={Code} text="Copy SVG Code" />
      </Box>
      <Text size="large" textAlign="center">
        <Anchor color="text" label="Sign in with Google" onClick={() => onClickSignIn()} /> to start a collection. Add your own patterns and save community patterns to your collection!
      </Text>
      <Box align="center"><Tagline /></Box>
    </InfoPanel>
  )
}

type UserInfoPanelProps = {
  onDismiss: Function
}

export const UserInfoPanel = ({ onDismiss }: UserInfoPanelProps) => {
  return (
    <InfoPanel
      onDismiss={onDismiss}
      color="#CBE580"
      headline={<>Let's get this party started!</>}
      headlineIcon={PartyHat}
    >
      <Text size="large" textAlign="center">
        Pattern Party is a place to share and collect svg patterns made via the wonderful <Anchor color="text" href="https://doodad.dev/pattern-generator" target="_blank" label="DOODAD.DEV" /> pattern generator tool.
      </Text>
      <Box fill="horizontal">
        <Carousel>
          <UserInfoPane screenShotName="intro-screen1.png" />
          <UserInfoPane screenShotName="intro-screen2.png" />
          <UserInfoPane screenShotName="intro-screen3.png" />
          <UserInfoPane screenShotName="intro-screen4.png" />
          <UserInfoPane>
            <Box fill align="center" justify="center" direction="row" gap="large">
              <InfoIcon icon={Gallery} text="Copy Data URL" />
              <InfoIcon icon={Code} text="Copy SVG Code" />
              <InfoIcon icon={Save} text="Save Pattern" />
            </Box>
          </UserInfoPane>
        </Carousel>
      </Box>
      <Box align="center"><Tagline /></Box>
    </InfoPanel>
  )
}

type UserInfoPaneProps = {
  screenShotName?: string
  text?: string
  children?: React.ReactNode
}

const UserInfoPane = ({ screenShotName, text, children }: UserInfoPaneProps) => {
  return (
    <Box gap="medium" height="medium">
      {text && <Text size="medium">{text}</Text>}
      {screenShotName && <Image fit="contain" src={`/images/${screenShotName}`} />}
      {children}
    </Box>
  )
}


type InfoIconProps = {
  icon: typeof Code
  text: string
}
const InfoIcon = ({ icon: Icon, text }: InfoIconProps) => {
  const size = React.useContext(ResponsiveContext)

  return (
    <Box gap="small" align="center">
      <Box css="border-radius: 100%" border={{size: "medium", color: "text"}} pad="medium">
        <Icon size={size === "small" ? "medium" : "large"} color="text" />
      </Box>
      <Text weight="bold">{text}</Text>
    </Box>
  )
}

type InfoPanelProps = {
  onDismiss: Function
  color: ColorType
  headline: string | JSX.Element
  headlineIcon?: typeof Pinata
  children?: React.ReactNode
}

export const InfoPanel = ({ color, onDismiss, headline, children, headlineIcon: HeadlineIcon }: InfoPanelProps) => {
  const size = React.useContext(ResponsiveContext)
  const isSmall = size === "small"

  return (
    <Box fill="horizontal" background={color} color="text" elevation="small">
      <Box direction="row" align="center" justify="center" gap="medium" >
        <Box fill pad="small">
          <Stack anchor="top-right">
            <Box direction="row" gap="small" align="center" justify="center">
              {HeadlineIcon && <HeadlineIcon size={isSmall ? "large" : "xlarge"} color="plain" />}
              <Heading level="1" size={isSmall ? "small" : "medium"}>{headline}</Heading>
            </Box>
            <Button icon={<Close color="text" size={isSmall ? "small" : "medium"} />} onClick={() => onDismiss()} />
          </Stack>
        </Box>
      </Box>
      <Box pad={{ horizontal: "large", bottom: "large", top: "small" }} gap="large">
        {children}
      </Box>
    </Box>
  )
}
