import React from 'react';
import { Grommet, grommet, Box } from "grommet"
import Patterns from "./components/Patterns"

function App() {
  return (
    <Grommet full theme={grommet}>
      <Box>
        <Patterns />
      </Box>
    </Grommet>
  )
}

export default App;
