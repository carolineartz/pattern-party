import * as React from "react"
import { Box, Footer, Text, Anchor } from "grommet"
import { ReactComponent as Logo } from "./../images/balloons.svg"
import { Balloons, Garland1, Garland2, Confetti } from "./Icon"
import { Github } from "grommet-icons"

export default () => (
  <Footer
    border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "top"
    }}
    pad="small"
  >
    <Confetti color="plain" size="large" />
    <Box direction="row" gap="medium" align="center">
      <Garland1 color="plain" size="medium-large" />
      <Text size="large">Because a party  without patterns is just a meeting</Text>
      <Garland2 color="plain" size="medium-large" />
    </Box>
    <Anchor
      icon={<Github />}
      href="https://github.com/carolineartz/pattern-party"
      target="_blank"
    />
  </Footer>
)
