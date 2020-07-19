import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  .appear-zoom-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .appear-zoom-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  .appear-zoom-exit {
    opacity: 1;
  }
  .appear-zoom-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }

  body {
    margin: 0;
  }
  css-doodle {
    height: 100%;
  }

  code[class*="language-"], pre[class*="language-"] {
    font-size: 0.8em;
  }

  span.inline-color {
    display: inline-block;
    height: 1.333ch;
    width: 1.333ch;
    margin: 0 .333ch;
    box-sizing: border-box;
    border: 1px solid white;
    outline: 1px solid black;
  }
`
