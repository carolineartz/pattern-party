import React from "react"
import styled, { keyframes } from "styled-components"
import { Box } from "grommet"

import { Candy2 } from "./Icon"

export const Loader = () => {
  return (
    <LoadingContainer align="center" justify="center">
      <Candy2 size="xlarge" color="plain" />
    </LoadingContainer>
  )
}

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const LoadingContainer = styled(Box)`
  animation: ${rotate} 3s steps(8, end) infinite;
`
