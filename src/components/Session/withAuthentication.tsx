import React from 'react';

import AuthUserContext from './context';
import { withFirebase, WithFirebaseProps } from '../Firebase';

type IAuthState = {
  authUser: firebase.User | object | null
}

const withAuthentication = (Component: React.ComponentType<WithFirebaseProps>) => {
  class WithAuthentication extends React.Component<WithFirebaseProps, IAuthState> {
    listener?: firebase.Unsubscribe

    constructor(props: WithFirebaseProps) {
      super(props);

      const storedUser = localStorage.getItem('authUser')
      this.state = {
        authUser: storedUser ? JSON.parse(storedUser) : null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        },
      );
    }

    componentWillUnmount() {
      this.listener && this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
