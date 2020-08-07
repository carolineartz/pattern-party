import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  // TRANSITION appear-zoom
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

  // TRANSITION slide-in-out-right

  // base
  .slide-in-out-right {
    transform: translate3d(100%, 0, 0);
    width: 0;
    visibility: hidden;
  }

  // appear
  .slide-in-out-right-enter {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  // enter / visible
  .slide-in-out-right-enter-active {
    transition: transform 1s ease;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }

  // leave
  .slide-in-out-right-exit {
    transform: translate3d(100%, 0, 0);
  }

  // exit / hide
  .slide-in-out-right-exit-active {
    transition: transform 1s ease;
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
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

  ::-moz-selection {
    color: white;
    background: #f95152;
  }

  ::selection {
    color: white;
    background: #f95152;
  }
`
