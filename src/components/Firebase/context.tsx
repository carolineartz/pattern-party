import * as React from 'react'
import Firebase, { IFirebase } from './firebase';

export const FirebaseContext = React.createContext<IFirebase>(new Firebase())

class FirebaseProvider extends React.Component<any & {firebase: Firebase}, IFirebase> {
  render() {
    return (
      <FirebaseContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </FirebaseContext.Provider>
    )
  }
}

const FirebaseContextConsumer = FirebaseContext.Consumer as any
export const withFirebase = (Component:any) => (props:any): JSX.Element => (
    <FirebaseContextConsumer>
      {(firebase: Firebase) => <Component firebase={firebase} {...props} />}
    </FirebaseContextConsumer>
  );

export default FirebaseProvider;
