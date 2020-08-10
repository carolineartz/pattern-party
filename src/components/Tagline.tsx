import * as React from "react"
import { Box,Text, ResponsiveContext } from "grommet"
import { Garland1, Garland2 } from "./Icon"

export const Tagline = () => {
  const size = React.useContext(ResponsiveContext)

  return (
    <Box direction="row" gap={size === "small" ? "xsmall" : "medium"} align="center">
      <Garland1 color="plain" size={size === "small" ? "xmedium" : "medium-large"} />
      <Text textAlign="center" size={size === "small" ? "small" : "large"}>Because a party  without patterns is just a meeting!</Text>
      <Garland2 color="plain" size={size === "small" ? "xmedium" : "medium-large"} />
    </Box>
  )
}
