  import { createContext, useState, useEffect } from "react";
  import { getProfile } from "../api/auth";
  import { getDepositMethod } from "../api/deposit";
  import { getPaymenttDetail } from "../api/deposit";

  export const AuthContext = createContext();

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [depositMethods, setDepositMethods] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);

    useEffect(() => {
      if (token) {
        getProfile(token)
          .then((res) => setUser(res.data))
          .catch(() => setUser(null));
        
          getDepositMethod(token)
          .then((res) => {
            // console.log("Deposit Methods in Context:", res);
            if (res.status === "success") {
              setDepositMethods(res.paymentMethod); // ✅ Correct Key
            } else {
              setDepositMethods([]);
            }
          })
          .catch(() => setDepositMethods([]));

          getPaymenttDetail(token)
          .then((res) => {
            // console.log("Deposit Methods in Context:", res);
            if (res.status === "success") {
              setPaymentDetails(res.paymentMethod); 
              console.log("Deposit Methods in Context:", res.paymentMethod);

            } else {
              setPaymentDetails([]);
            }
          })
          .catch(() => setPaymentDetails([]));
      }
    }, [token]);

    
    return (
      <AuthContext.Provider value={{ user, setUser,token, setToken ,depositMethods, paymentDetails}}>
        {children}
      </AuthContext.Provider>
    );
  }
