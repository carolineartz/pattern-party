import * as React from "react"
import { Box, Footer, Text, Anchor } from "grommet"
import { ReactComponent as Logo } from "./../images/balloons.svg"
import { Balloons, Pinata, Present} from "./Icon"
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
    <Balloons color="plain" size="medium-large" />
    <Box direction="row" gap="medium" align="center"><Present color="plain" size="large" /><Text size="large">Because a party  without patterns is just a meeting</Text><Pinata color="plain" size="large" /></Box>
    <Anchor
      icon={<Github />}
      href="https://github.com/carolineartz/pattern-party"
      target="_blank"
    />
  </Footer>
)
