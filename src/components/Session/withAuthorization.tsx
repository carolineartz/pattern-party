import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase, WithFirebaseProps } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { WithRouterProps } from '.';

type IAuthState = {
  authUser: firebase.User | null
}

// interface ComponentProps extends WithFirebaseProps

const ConsumerContext = AuthUserContext.Consumer as any // TODO: figure out missing children thing

const withAuthorization = (condition: (user?: firebase.User) => boolean) => (Component: React.ComponentType<any>) => {
  class WithAuthorization extends React.Component<any & WithFirebaseProps & WithRouterProps, IAuthState> {
    listener?: firebase.Unsubscribe

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser: IAuthState['authUser']) => {
          // need this?
          if (!authUser) {
            this.props.history.push(ROUTES.EXPLORE);
          }

          else if (!condition(authUser || undefined)) {
            this.props.history.push(ROUTES.EXPLORE);
          }
        },
        () => this.props.history.push(ROUTES.EXPLORE),
      );
    }

    componentWillUnmount() {
      this.listener && this.listener();
    }

    render() {
      return (
        <ConsumerContext>
          {(authUser: IAuthState['authUser']) =>
            condition(authUser || undefined) ? <Component {...this.props} /> : null
          }
        </ConsumerContext>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
