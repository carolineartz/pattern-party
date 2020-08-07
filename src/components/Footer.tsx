import * as React from "react"
import { Footer, Anchor } from "grommet"
import { Confetti } from "./Icon"
import { Tagline } from "./Tagline"
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
    <Tagline />
    <Anchor
      icon={<Github />}
      href="https://github.com/carolineartz/pattern-party"
      target="_blank"
    />
  </Footer>
)
