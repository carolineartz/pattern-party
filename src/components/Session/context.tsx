import React from 'react';
import firebase from '../Firebase';

const AuthUserContext = React.createContext<firebase.User | null | object>(null);

export default AuthUserContext;
