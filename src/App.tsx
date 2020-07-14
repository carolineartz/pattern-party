import React from 'react';
import { Grommet, grommet, Box } from "grommet"
import Patterns from "./components/Patterns"
import { deepFreeze, deepMerge } from 'grommet/utils';

// const customTheme = deepFreeze(deepMerge({

// }, grommet))

function App() {
  return (
    <Grommet theme={{
      icon: {
        size: {
          "medium-small": "18px"
        }
      }
    }}>
      <Box>
        <Patterns />
      </Box>
    </Grommet>
  )
}

export default App;
