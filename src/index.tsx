import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { enableMapSet } from "immer"

import "css-doodle"
// import { AuthContextProvider } from './components/Session';
// import { PatternsProvider, initialPatterns } from "./components/Patterns/context"

// {/* <AuthContextProvider value={null}>
//   </AuthContextProvider>, */}
enableMapSet()
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
