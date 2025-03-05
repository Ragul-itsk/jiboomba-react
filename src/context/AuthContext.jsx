import { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
