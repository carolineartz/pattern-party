import { deepFreeze, deepMerge } from 'grommet/utils';
import { grommet } from "grommet"

export const theme = deepFreeze(deepMerge(grommet, {
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
