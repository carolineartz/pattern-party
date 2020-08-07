import * as React from "react"
import { Box,Text } from "grommet"
import { Garland1, Garland2 } from "./Icon"

export const Tagline = () => (
  <Box direction="row" gap="medium" align="center">
    <Garland1 color="plain" size="medium-large" />
    <Text size="large" weight="bold">Because a party  without patterns is just a meeting!</Text>
    <Garland2 color="plain" size="medium-large" />
  </Box>
)
