import * as React from "react"

import Rainbow from "rainbow-code"
import "rainbow-code/themes/css/zenburnesque.css"

import styled, { css } from "styled-components"

import { Box } from "grommet"

type DoodleProps = {
  markup: string
  ident: string
}

export const Doodle = ({ markup, ident }: DoodleProps) => {
  const [active, setActive] = React.useState<boolean>(false)

  React.useEffect(() => {
    const foo = Rainbow

    // debugger
  })

  return (
    <>
      <DoodleContainer key={ident} active={active} markup={markup} elevation="small" onClick={() => setActive(!active)}>
        <css-doodle grid="1" use="var(--pattern)" />
      </DoodleContainer>
      {active && <SVGMarkupContainer key={`${ident}-markup`}>This is the markup container</SVGMarkupContainer>}
    </>
  )
}

type DoodleContainerProps = {
  active: boolean
  markup: string
}


// const DoodleContainer = styled(Box)<DoodleContainerProps>`
const DoodleContainer = styled(Box)<DoodleContainerProps>`
  --pattern: ${props => "(background-image: @svg(" + props.markup + "));"};
  ${props => props.active && css`
    grid-column: 1;
    grid-row: 1 / 4;
  `}
`


const SVGMarkupContainer = styled(Box)`
  grid-column: 2 / -1;
  grid-row: 1 / 4;
`
