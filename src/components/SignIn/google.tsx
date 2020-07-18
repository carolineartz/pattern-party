import * as React from "react"
import "styled-components/macro"

import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { useDeviceDetect } from "./../../hooks/useDeviceDetect"
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Box, Button, Text, Nav, Anchor } from "grommet"
import * as ROUTES from "./../../constants/routes"
import GoogleButton from 'react-google-button'

type WithRouterProps = {
  history: any
}

const GoogleAuth = ( {firebase, history }: WithFirebaseProps & WithRouterProps) => {
  const [error, setError] = React.useState<string | null>(null)

  // const { isMobile } = useDeviceDetect();

    return (
      <Box>
      <GoogleButton
        onClick={() => { console.log('Google button clicked') }}
      />
      </Box>
    )
}

{/*
class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          },
          { merge: true },
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Google</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
} */}
