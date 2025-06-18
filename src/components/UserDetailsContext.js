import React, { createContext, useContext } from "react";
import Cookies from "js-cookie";

// Create the context
export const UserContext = createContext({ user: null });

// Create the provider component
const UserProvider = ({ children }) => {
  const userStr = Cookies.get("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserProvider;

// Custom hook to use the user context
export const useUserDetails = () => useContext(UserContext);
