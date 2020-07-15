import * as React from "react"

import "styled-components/macro"
import { Box, ThemeContext, ThemeType } from "grommet"

type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never;

export function ElevatedHoverBox({ elevation, disableHoverElevation = false, ...props }: PropsOf<typeof Box> & { disableHoverElevation?: boolean }) {
  const theme: ThemeType & { dark?: boolean } = React.useContext(ThemeContext)
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
    />
  )
}
