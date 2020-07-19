import AuthUserContext from './context';
import withAuthentication from './withAuthentication';
import withAuthorization from './withAuthorization';

export {
  AuthUserContext,
  withAuthentication,
  withAuthorization
};

export type WithAuthProps = {
  authUser: firebase.User
  children: React.ReactNode
}

export type WithRouterProps = {
  history: any
  children: React.ReactNode
}
