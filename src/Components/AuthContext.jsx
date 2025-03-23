import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const user_id = localStorage.getItem("user_id");
    console.log("AuthContext - Initial Load:", { token, username, user_id });
    if (token && username && user_id) {
      setUser({ username, token, user_id }); 
    }
  }, []);

  const login = (username, token, user_id) => {
    console.log("AuthContext - Login:", { username, token, user_id });
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", user_id); 
    setUser({ username, token, user_id }); 
  };

  const logout = () => {
    console.log("AuthContext - Logout"); 
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id"); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};