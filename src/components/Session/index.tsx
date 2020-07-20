import AuthContext, { withAuthentication, withAuthorization } from './context';

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
