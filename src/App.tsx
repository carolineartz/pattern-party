import React from 'react';
import { Grommet, grommet, Box } from "grommet"
import Patterns from "./components/Patterns"

function App() {
  return (
    <Grommet theme={grommet}>
      <Box>
        <Patterns />
      </Box>
    </Grommet>
  )
}

export default App;
