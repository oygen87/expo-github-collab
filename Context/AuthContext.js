import React, { useState } from "react";

export const AuthContext = React.createContext();

export const AuthProvider = props => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={[isLoggedIn, setLoggedIn]}>
      {props.children}
    </AuthContext.Provider>
  );
};
