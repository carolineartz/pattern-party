import * as React from "react"
import styled from "styled-components"
import "styled-components/macro"

import { Box, BoxProps } from "grommet"

type PatternGridProps = BoxProps & {
  colMinWidth?: string
  colMaxWidth?: string
  rowMinHeight?: string
  rowMaxHeight?: string
  children?: React.ReactNode
}

export const PatternGrid = (props: PatternGridProps) => (
  <Box pad={{ horizontal: "medium", bottom: "medium" }} width={{ max: "1080px" }} margin="auto" css='width: 100%'>
    <Grid {...props}>
      {props.children}
    </Grid>
  </Box>
)

export const Grid = styled(Box)<PatternGridProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: ${props => `repeat(auto-fill, minmax(${props.colMinWidth || '250px'}, 1fr))`};
  grid-auto-rows: ${props => `minmax(${props.rowMinHeight || '150px'}, ${props.rowMaxHeight || '25vh'})`};
`
