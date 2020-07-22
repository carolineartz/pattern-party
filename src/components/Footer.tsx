import * as React from "react"
import { Box, Footer, Text, Anchor } from "grommet"
import { ReactComponent as Logo } from "./../images/cupcake-logo-white-outline.svg"
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
    <Box align="center" direction="row" gap="xsmall">
      <Logo />
    </Box>
    <Text>Because a party without patterns is just a meeting</Text>
    <Anchor
      icon={<Github />}
      href="https://github.com/carolineartz/pattern-party"
      target="_blank"
    />
  </Footer>
)