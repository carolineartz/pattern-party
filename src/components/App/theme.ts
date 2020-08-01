import { deepFreeze, deepMerge } from 'grommet/utils';
import { grommet } from "grommet"

export const theme = deepFreeze(deepMerge(grommet, {
  global: {
    font: {
      family: "Inconsolata, Anonymous Pro, Montserrat, monospace"
    },
    colors: {
      text: {
        light: "rgba(39, 36, 66, 1.000)"
      },
      brand: "rgba(219, 16, 111, 1.000)"
    }
  },
  anchor: {
    fontWeight: 400
  },
  icon: {
    size: {
      "medium-small": "18px"
    }
  }
}))
