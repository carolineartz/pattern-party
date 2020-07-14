import * as React from "react"

import "styled-components/macro"
import { Box, ThemeContext, ThemeType } from "grommet"

type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never;
const ThemeContextConsumer = ThemeContext.Consumer as any

export function ElevatedHoverBox({children, elevation, disableHoverElevation = false, ...props}: PropsOf<typeof Box> & { disableHoverElevation?: boolean }) {
  return (
    <ThemeContextConsumer>
      {(theme: ThemeType & { dark?: boolean }) => {
        const lightOrDark = Boolean(theme.dark) ? "dark" : "light"
        const elevations = theme!.global!.elevation!

        return (
          <Box {...props}
            elevation="small"
            css={`
              &:hover {
                box-shadow: ${disableHoverElevation ? elevations[lightOrDark]!.small! : elevations[lightOrDark]!.xlarge!}
              }
            `}
          >
           {children}
        </Box>
        )
      }}
    </ThemeContextConsumer>
  )
}

// <div style={{ backgroundColor: theme.global.colors["neutral-3"] }}>
//   <p style={{ color: theme.global.colors["light-1"] }}>
//     This component is leveraging the grommet theme capabilities although
//     it is not a grommet component
//   </p>
// </div>

// type ElevatedBoxProps =

