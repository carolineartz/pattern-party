import React from 'react';
import Firebase, { WithFirebaseProps } from '../Firebase';

import { withFirebase } from '../Firebase';
import { WithRouterProps } from '.';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

type IAuthState = {
  authUser?: firebase.User | null
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
          console.log("authUser", authUser)

          if (!authUser) {
            debugger
            this.setState({authUser: null})
          }
          this.setState({authUser})
        },
        () => {
          console.log("doing fallback")
          this.setState({authUser: null})
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
  class WithAuthorization extends React.Component<any & WithFirebaseProps & WithRouterProps, any> {
    listener?: firebase.Unsubscribe

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser: IAuthState['authUser']) => {
          // need this?
          if (!authUser) {
            this.props.history.push(ROUTES.LANDING);
          }

          else if (!condition(authUser)) {
            this.props.history.push(ROUTES.LANDING);
          }
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
          {(authUser: firebase.User) => condition(authUser) ? <Component authUser={authUser} {...this.props} /> : <></>}
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
