import { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth";
import { getDepositMethod } from "../api/deposit";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [depositMethods, setDepositMethods] = useState([]);


  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        });

      getDepositMethod(token)
        .then((res) => {
          if (res.status === "success") {
            setDepositMethods(res.paymentMethod);
          } else {
            setDepositMethods([]);
          }
        })
        .catch(() => setDepositMethods([]));
    }
  }, [token]);

  useEffect(() => {
    // Retrieve user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };



  return (
    <AuthContext.Provider value={{ user, token, updateToken, depositMethods }}>
      {children}
    </AuthContext.Provider>
  );
}
