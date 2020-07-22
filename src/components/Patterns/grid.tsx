import styled from "styled-components"
import { Box, BoxProps } from "grommet"

type PatternGridProps = BoxProps & {
  colMinWidth?: string
  colMaxWidth?: string
  rowMinHeight?: string
  rowMaxHeight?: string
}

export const PatternGrid = styled(Box)<PatternGridProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: ${props => `repeat(auto-fill, minmax(${props.colMinWidth || '250px'}, 1fr))`};
  grid-auto-rows: ${props => `minmax(${props.rowMinHeight || '150px'}, ${props.rowMaxHeight || '25vh'})`};
`