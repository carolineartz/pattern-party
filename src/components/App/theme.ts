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
      brand: "#f95152"
    }
  },
  anchor: {
    fontWeight: 400
  },
  card: {
    container: {
      round: 'small',
      elevation: 'small',
    },
    header: {},
    body: {},
    footer: {
      background: 'background-contrast',
    },
  },
  icon: {
    size: {
      "medium-large": "72px",
      "medium-small": "18px",
      "xmedium": "36px",
      "xxxlarge": "256px"
    }
  }
}))
