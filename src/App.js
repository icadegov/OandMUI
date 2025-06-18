import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppRoutes from "./Router/AppRoutes";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import UserProvider from "./components/UserDetailsContext";
import LoginMenu from "./components/CommonHeader";
import Sidemenu from "./components/sidemenu/Sidebar";
import SidemenuRti from "./components/sidemenu/SidebarRti";
import { MenuProvider, useMenu } from "./components/sidemenu/MenuContext";
import useTokenRefresher from "./components/TokenRefresher";

function ConditionalHeaders() {
  const pathlocation = useLocation();
  useTokenRefresher();

  const { activeMenu } = useMenu(); //  get it from context

  if (activeMenu === "rti" && pathlocation.pathname.includes("/rtidashboard")) {
    return <SidemenuRti />;
  }

  if (activeMenu === "oandm" && pathlocation.pathname.includes("/oandmdashboard")) {
    return <Sidemenu />;
  }

  return null; // Default return if no condition matches
}

function App() {
  return (
    <div className="App">
      <Router>
        <MenuProvider>
          <UserProvider>
            <LoginMenu />
            <ConditionalHeaders />
            <AppRoutes />
          </UserProvider>
        </MenuProvider>
      </Router>
    </div>
  );
}

export default App;
