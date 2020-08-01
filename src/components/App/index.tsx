import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grommet, Layer, Box } from "grommet"

import Header from "../Header"
import PatternsPage, { CreatePattern } from "../Patterns"
import Login from "../Login"
import { withAuthentication, WithAuthProps } from '../Session';

import { theme } from "./theme"
import { GlobalStyles } from './globalStyles';
import * as ROUTES from '../../constants/routes';

const App = ({ authUser }: WithAuthProps) => {
  const [showSignIn, setShowSignIn] = React.useState<boolean>(false)
  const [showCreate, setShowCreate] = React.useState<boolean>(false)

  return (
    <Router>
      <Grommet theme={theme}>
        <GlobalStyles />

        {!authUser && showSignIn &&
          <Layer
            responsive={false}
            full="horizontal"
            position="top"
            onEsc={() => setShowSignIn(false)}
            onClickOutside={() => setShowSignIn(false)}
          >
            <Login />
          </Layer>
        }
        {(!showSignIn || authUser) &&
          <Layer responsive={false} full="horizontal" modal={false} position="top">
            <Header
              onClickSignIn={() => setShowSignIn(true)}
              onClickSignOut={() => {
                setShowCreate(false)
                setShowSignIn(false)
              }}
              onClickCreate={() => setShowCreate(true)}
            />
          </Layer>
        }
        { authUser && <CreatePattern showCreate={showCreate} setShowCreate={setShowCreate} /> }
        <Box fill margin={{top: "large"}}>
          <Route exact path={ROUTES.LANDING} component={PatternsPage} />
          <Route path={ROUTES.MY_PATTERNS} component={PatternsPage} />
        </Box>
      </Grommet>
    </Router>
  )
}

export default withAuthentication(App);
