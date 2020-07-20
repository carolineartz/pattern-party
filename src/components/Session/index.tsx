import AuthContext, { withAuthentication, withAuthorization } from './context';
// import withAuthentication from './withAuthentication';
// import withAuthorization from './withAuthorization';

export {
  withAuthentication,
  withAuthorization,
  AuthContext
};

export type WithAuthProps = {
  authUser?: firebase.User | null
  children: React.ReactNode
}

export type WithRouterProps = {
  history: any
  children?: React.ReactNode
}
