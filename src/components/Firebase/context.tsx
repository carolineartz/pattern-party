import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase>(new Firebase());

// export const withFirebase = (Component: React.ComponentClass) => (props: any) => (
//   <FirebaseContext.Consumer>
//     {(firebase: Firebase) => <Component {...props} firebase={firebase} />}
//   </FirebaseContext.Consumer>
// );

// interface Props extends React.ConsumerProps<Firebase> {
//   children: (value: Firebase) => React.ReactNode
// }

// type Props = React.ConsumerProps<any>

const Blah = FirebaseContext.Consumer as any

// export function withFirebase<P extends Props, S = any>(Component: React.ComponentClass<P, S>): (props: P) => React.ComponentClass {
//   return (props: P) => (
//     <FirebaseContext.Consumer>
//       {(firebase: Firebase) => <Component {...props} firebase={firebase} />}
//     </FirebaseContext.Consumer>
//   )
// }

export const withFirebase = (Component: any) => (props: any) => {
  return <Blah>
    {(firebase: Firebase) => <Component {...props} firebase={firebase} />}
  </Blah>
};

export default FirebaseContext;


