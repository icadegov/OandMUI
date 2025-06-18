import React, { useEffect, useRef, useState } from 'react';
import keycloak from '../../services/Keycloak';
import UserService from '../../services/UserService';

export default function useAuth() {
  const [login, setLogin] = useState(false);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    // Log the client to check its configuration
    //console.log("Keycloak Client Instance:", keycloak);

    keycloak.init({ onLoad: "login-required" }).then((res) => {//console.log("response in keycloack", keycloak.token); 
      window.localStorage.setItem('KC_TOKEN', keycloak.token);
console.log("response in keycloack", keycloak.token);
      keycloak.loadUserProfile().then((profile) => {
        console.log("User profile in use auth:", profile);

        // Retrieve username from Keycloak token
        const username = keycloak.tokenParsed?.preferred_username;
        //console.log("Username from Keycloak:", username);
         window.localStorage.setItem('username', username); // Store username too

         // Access custom attributes if they exist
        const empid = profile.attributes?.empid?.[0]; // Attributes are often arrays
    console.log("User empid:", empid);
    
    // Store in localStorage
    if (empid) {
        window.localStorage.setItem('empid', empid);
        //UserService.getUserDetailsFromHRMS(empid);
    } else {
        console.warn('empid not found in user profile attributes.');
    }
      }); 
     
      setLogin(res)}).catch((error) => {
        console.error("Keycloak initialization failed:", error);
      });


  }, []);

  return login;
}

// code 2

// import { useState, useEffect } from 'react';
// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//   url: 'http://localhost:8080/auth',
//   realm: 'newrealm',
//   clientId: 'newclient',
// });

// const useAuth = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//     const initKeycloak = async () => {
//       try {
//         await keycloak.init({ onLoad: 'login-required' });
//         setIsLoggedIn(keycloak.authenticated);
//         setIsLoading(false);
//       } catch (error) {
//         setError(error);
//         setIsLoading(false);
//       }
//     };

//     initKeycloak();
//   }, []);

//   const login = () => {
//     keycloak.login();
//   };

//   const logout = () => {
//     keycloak.logout();
//   };

//   return { isLoggedIn, isLoading, error, login, logout };
// };

// export default useAuth;
