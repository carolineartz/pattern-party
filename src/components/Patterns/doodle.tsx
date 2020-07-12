import * as React from "react"
import Rainbow from "rainbow-code"

import styled from "styled-components"

import { Box } from "grommet"

type DoodleProps = {
  markup: string
}

export const Doodle = ({ markup }: DoodleProps) => {
  React.useEffect(() => {
    const foo = Rainbow

    // debugger
  })

  return (
    <DoodleContainer markup={markup} elevation="small">
      <css-doodle grid="1" use="var(--pattern)" />
    </DoodleContainer>
  )
}

type DoodleContainerProps = {
  patternSVG: string
}


// const DoodleContainer = styled(Box)<DoodleContainerProps>`
const DoodleContainer = styled(Box)<DoodleProps>`
  --pattern: ${props => "(background-image: @svg(" + props.markup + "));"};
`


  //   (
  //   background-image: @svg(
  //     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">
  //       <defs>
  //         <pattern id="pattern" width="65" height="65" viewBox="0 0 40,40" patternUnits="userSpaceOnUse" patternTransform="rotate(191)">
  //           <rect id="pattern-background" width="400%" height="400%" fill="rgba(250, 234, 92,1)"/>
  //           <path fill="rgba(10, 183, 186,1)" d="M 0 20 a 12.5 12.5 0 0 0 25 0 h-5 a 7.5 7.5 0 0 1 -15 0z" />
  //           <path fill="rgba(49, 74, 89,1)" d="M -7 20 a 20 20 0 0 1 40 0 h-20 a 0 0 0 0 0 0 0z M 33 20 a 20 20 0 0 1 40 0 h-20 a 0 0 0 0 0 0 0z"/>
  //         </pattern>
  //       </defs>
  //       <rect fill="url(#pattern)" height="100%" width="100%"/>
  //     </svg>
  //   )
  // )
