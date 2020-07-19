import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

type IAuthState = {
  authUser: firebase.User | null
}

const withAuthentication = (Component: React.ComponentType<any>) => {
  class WithAuthentication extends React.Component<any, IAuthState> {
    listener?: firebase.Unsubscribe

    constructor(props: any) {
      super(props);

      const storedUser = localStorage.getItem('authUser')
      this.state = {
        authUser: storedUser ? JSON.parse(storedUser) : null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser: IAuthState['authUser']) => {
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
