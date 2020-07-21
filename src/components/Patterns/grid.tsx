import styled from "styled-components"
import { Box, BoxProps } from "grommet"

export const PatternGrid = styled(Box)<BoxProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`