import React from 'react';
import { Grommet, grommet, Box } from "grommet"
import Patterns from "./components/Patterns"
import { deepFreeze, deepMerge } from 'grommet/utils';
import Header from "./components/Header"

const customTheme = deepFreeze(deepMerge(grommet, {
  global: {
    font: {
      family: "Anonymous Pro, monospace"
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
      <Header />
      <Box>
        <Patterns />
      </Box>
    </Grommet>
  )
}

export default App;
