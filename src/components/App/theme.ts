import { deepFreeze, deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from "grommet"
import {StatusGoodSmall} from "grommet-icons"

export const theme: ThemeType = deepFreeze(deepMerge(grommet, {
  global: {
    font: {
      family: "Inconsolata, Anonymous Pro, monospace"
    },
    colors: {
      text: {
        light: "rgba(39, 36, 66, 1.000)"
      },
      brand: "#f95152",
      "accent-1": "#3BD2D3",
      "accent-2": "#CBE580"
    }
  },
  anchor: {
    fontWeight: 700,
    textDecoration: "underline"
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
  carousel: {
    icons: {
      current: StatusGoodSmall
    }
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
