import * as React from "react"
import { Box, Footer, Text, Anchor } from "grommet"
import { ReactComponent as Logo } from "./../images/balloons.svg"
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
    <Box width="xxsmall">
      <Logo style={{height: "100%", width: "100%"}} height="100%" />
    </Box>
    <Text>Because a party without patterns is just a meeting</Text>
    <Anchor
      icon={<Github />}
      href="https://github.com/carolineartz/pattern-party"
      target="_blank"
    />
  </Footer>
)
