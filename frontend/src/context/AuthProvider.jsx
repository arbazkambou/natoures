import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("user") ? true : false
  );
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : ""
  );
  useEffect(
    function () {
      if (user) setIsAuthenticated(true);
      else setIsAuthenticated(false);
    },
    [user.id]
  );
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, setUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
