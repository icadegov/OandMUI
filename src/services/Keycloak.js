// keycloak.js
import Keycloak from 'keycloak-js';


 const keycloakConfig = {
   //url: 'http://localhost:9090/',
   url: 'http://192.168.1.122:8080/',
   realm: 'icad',
   clientId: 'icad_client',
   "public-client": true,
  "cors": {
     "allowed-origins": ["http://localhost:3000"]
   },
   "enable-cors" : true,
};


// const keycloakConfig = new Keycloak({
//   url: 'http://localhost:9090/',  // Keycloak URL
//   realm: 'icad',               // Your realm name
//   clientId: 'icadclient',      // Your client ID
// });

// initializes a new instance of Keycloak 
const keycloak = new Keycloak(keycloakConfig);  

export default keycloak;



// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//   url: 'http://localhost:8080/', 
//   realm: 'react-realm',             
//   clientId: 'student-client',       
// });

// export const initializeKeycloak = () => {
//   return keycloak.init({
//     onLoad: 'login-required', // Checks if a user is logged in without redirecting
//     checkLoginIframe: false, // Disable the iframe check
//   });
// };

// export default keycloak;



// Function to initialize Keycloak instance and load it
// export const initializeKeycloak = () => {
//   return keycloak.init({
//     onLoad: 'login-required',         // Automatically redirect to Keycloak if not logged in
//     checkLoginIframe: false,          // Disable iframe checking for simplicity
//   }).catch((error) => {
//     console.error('Keycloak initialization failed', error);
//     throw new Error('Keycloak initialization failed');
//   });
// };

// // Function to get the Keycloak token for API requests
// export const getToken = () => keycloak.token;

// // Helper function to check if the user is authenticated
// export const isAuthenticated = () => !!keycloak.authenticated;

// // Function to logout the user via Keycloak
// export const logout = () => {
//   keycloak.logout();
// };





// // src/services/keycloak.js
// import Keycloak from 'keycloak-js';

// // Create a Keycloak instance with the configuration
// const keycloak = new Keycloak({
//   url: 'http://localhost:8080/auth', // Keycloak server URL
//   realm: 'react-realm',              // Your Keycloak realm
//   clientId: 'student-client',           // Client ID from Keycloak
// });

// // Function to initialize Keycloak instance and load it
// export const initializeKeycloak = () => {
//   return keycloak.init({
//     onLoad: 'login-required',    // Automatically redirect to Keycloak if not logged in
//     checkLoginIframe: false,     // Disable iframe checking for simplicity
//   });
// };

// // Function to get the Keycloak token for API requests
// export const getToken = () => keycloak.token;

// // Helper function to check if the user is authenticated
// export const isAuthenticated = () => !!keycloak.authenticated;

// // Function to logout the user via Keycloak
// export const logout = () => {
//   keycloak.logout();
// };

// export default keycloak;
