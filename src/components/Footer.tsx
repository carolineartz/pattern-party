import * as React from "react"
import { Footer, Anchor, ResponsiveContext, Box } from "grommet"
import { Confetti } from "./Icon"
import { Tagline } from "./Tagline"
import { Github } from "grommet-icons"

export default () => {
  const size = React.useContext(ResponsiveContext)

  return (
    <Footer
      border={{
        "color": "light-4",
        "size": "xsmall",
        "style": "solid",
        "side": "top"
      }}
      pad="small"
    >
      <Box pad="medium" margin={{right: "small"}}><Confetti color="plain" size="medium" /></Box>
      <Tagline />
      <Anchor
        icon={<Github />}
        href="https://github.com/carolineartz/pattern-party"
        target="_blank"
      />
    </Footer>
  )
}
