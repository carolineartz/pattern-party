import React from 'react';
import { Grommet, grommet, Box } from "grommet"
import Patterns from "./components/Patterns"
import { deepFreeze, deepMerge } from 'grommet/utils';
import Header from "./components/Header"

import {createGlobalStyle} from "styled-components"

const customTheme = deepFreeze(deepMerge(grommet, {
  global: {
    font: {
      family: "Montserrat, Anonymous Pro, monospace"
    },
    colors: {
      text: {
        light: "rgba(53, 52, 88,1)"
      }
    }
  },
  icon: {
    size: {
      "medium-small": "18px"
    }
  }
}))

function App() {
  return (
    <Grommet theme={customTheme}>
      <GlobalStyles/>
      <Header />
      <Box>
        <Patterns />
      </Box>
    </Grommet>
  )
}

const GlobalStyles = createGlobalStyle`
  .appear-zoom-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .appear-zoom-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  .appear-zoom-exit {
    opacity: 1;
  }
  .appear-zoom-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }
`

export default App;
