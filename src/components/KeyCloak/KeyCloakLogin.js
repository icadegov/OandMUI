import React from 'react'
 
import Protected from './Protected'
import Public from './Public'

import useAuth from './useAuth'
import Dashboard1 from '../../DBViews/dashboards/Dashboard1';

//export default function KeyCloakLogin() {
  const KeyCloakLogin = () => {
  const login = useAuth()
  window.localStorage.setItem('isAuthenticated', login);
  return (
    login ? <Dashboard1 /> : <Public/>
  )
}

export default KeyCloakLogin;
// code2

// import React from 'react';
// import useAuth from './useAuth';
// import Protected from './Protected';
// import Public from './Public';

// function KeyCloakLogin() {
//   const { isLoggedIn, isLoading, error } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return isLoggedIn ? <Protected /> : <Public />;
// }

// export default KeyCloakLogin;