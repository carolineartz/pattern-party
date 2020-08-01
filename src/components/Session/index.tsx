import AuthContextProvider, { withAuthentication, withAuthorization } from './context';

export {
  withAuthentication,
  withAuthorization,
  AuthContextProvider
};

export type WithAuthProps = {
  authUser?: firebase.User | null
  children: React.ReactNode
}

export type WithRouterProps = {
  history: any
  children?: React.ReactNode
}