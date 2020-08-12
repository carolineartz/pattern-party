import React from 'react';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Firebase, { WithFirebaseProps, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

type IAuthState = {
  authUser?: firebase.User
}
export const AuthContext = React.createContext<{ authUser: IAuthState['authUser'] }>({authUser: undefined});

export class AuthContextProvider extends React.Component<any & { firebase: Firebase, authUser: firebase.User }, IAuthState> {
  listener?: firebase.Unsubscribe

  state = {
    authUser: undefined
  }

  componentDidMount() {
    if (!this.state.authUser) {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser: IAuthState['authUser']) => {
          if (!authUser) {
            this.setState({authUser: undefined})
          }
          this.setState({authUser})
        },
        () => {
          this.setState({authUser: undefined})
        }
      )
    }
  }

  componentWillUnmount() {
    this.listener && this.listener();
  }

  render() {
    return (
      <AuthContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthContextConsumer = AuthContext.Consumer as any

export const withAuthentication = (Component:any) => (props:any): JSX.Element => (
    <AuthContextConsumer>
      {(state: IAuthState) => <Component authUser={state.authUser} {...props} />}
    </AuthContextConsumer>
);

export const withAuthorization = (condition: (user?: firebase.User) => boolean) => (Component: React.ComponentType<any>) => {
  class WithAuthorization extends React.Component<any & WithFirebaseProps & RouteComponentProps, any> {
    listener?: firebase.Unsubscribe

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser: IAuthState['authUser']) => {
          // need this?
          if (!authUser || !condition(authUser)) {
            this.props.history.push(ROUTES.LANDING);
          }

          // else {
          //   this.props.history.push(ROUTES.MY_PATTERNS)
          // }
        },
        () => this.props.history.push(ROUTES.LANDING),
      );
    }

    componentWillUnmount() {
      this.listener && this.listener();
    }

    render() {
      return (
        <AuthContextConsumer>
          {(props: { authUser: firebase.User }) => condition(props.authUser) ? <Component authUser={props.authUser} {...this.props} /> : <></>}
        </AuthContextConsumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withFirebase(AuthContextProvider);
