/// <reference types="react-scripts" />

import {} from "react"
import { CSSProp } from "styled-components"

declare module "react-google-button";
declare module "mini-svg-data-uri";
declare module "pizzaz";
declare module "json-circular-stringify";

declare module "react" {
  interface Attributes {
    css?: CSSProp
  }

  namespace JSX {
      interface IntrinsicElements {
    "css-doodle": any;
        "iframe": any;
        "pre": any;
        "code": any;
  }
  }
}

declare module "css-doodle" {}

declare namespace JSX {
  interface IntrinsicElements {
    "css-doodle": any;
    "iframe": any;
  }
}

