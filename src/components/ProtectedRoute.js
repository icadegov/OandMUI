
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children}) => {
  //const isAuthenticated = localStorage.getItem('isAuthenticated');
  const isAuthenticated = Cookies.get('user') ? true : false;

  return (
    // Example check
   isAuthenticated ? children : (window.location.href = "http://localhost:3000/icad/dashboard")
  );
};

export default ProtectedRoute;
