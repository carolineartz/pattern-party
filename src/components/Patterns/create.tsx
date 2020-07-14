import * as React from "react"

import "styled-components/macro"

import { Box } from "grommet"

export const CreatePatternIFrame = () => {
  return (
    <Box height="70vh" width="100%">
      <iframe
        src="https://doodad.dev/pattern-generator/"
        seamless
        frameBorder={0}
        css={`
          height: 100%;
          width: 100%;`
        }
      />
    </Box>
  )
}
