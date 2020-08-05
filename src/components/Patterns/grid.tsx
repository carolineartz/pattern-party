import * as React from "react"
import { Box, Grid, ResponsiveContext } from "grommet"
import "styled-components/macro"

export const PatternGrid = ({children}: {children?: React.ReactNode}) => {
  const size = React.useContext(ResponsiveContext);

  return (
    <Box pad={{ horizontal: "medium", bottom: "medium" }} width={{ max: "1080px" }} margin="auto" css='width: 100%'>
      <Grid columns={size !== 'small' ? 'medium' : '100%'} gap="medium">
        {children}
      </Grid>
    </Box>
  )
}
