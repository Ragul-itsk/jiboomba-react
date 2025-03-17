// import { createContext, useState, useEffect } from "react";
// import { getProfile } from "../api/auth";
// import { getDepositMethod } from "../api/deposit";
// import { useNavigate } from "react-router-dom";


// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [depositMethods, setDepositMethods] = useState([]);


  


//   useEffect(() => {

//     if (!token) {
  
//       navigate("/login");
//       return;
//     }
//     if (token) {
//       getProfile(token)
//         .then((res) => setUser(res.data))
//         .catch(() => setUser(null));

//       getDepositMethod(token)
//         .then((res) => {
//           if (res.status === "success") {
//             setDepositMethods(res.paymentMethod);
//           } else {
//             setDepositMethods([]);
//           }
//         })
//         .catch(() => setDepositMethods([]));
//     }
//   }, [token]);

//   // Persist token when changed
//   const updateToken = (newToken) => {
//     setToken(newToken);
//     localStorage.setItem("token", newToken);
//   };


//   return (
//     <AuthContext.Provider value={{ user, setUser, token, updateToken, depositMethods  }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



import { createContext, useState, useEffect } from "react";
import { getProfile, verifyToken  } from "../api/auth";
import { getDepositMethod } from "../api/deposit";
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [depositMethods, setDepositMethods] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // First verify token before making profile & deposit method requests
    verifyToken(token)
      .then((res) => {
        if (res?.status === 200) {
          // Token is valid, proceed with fetching user data
          getProfile(token)
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));

          getDepositMethod(token)
            .then((res) => {
              if (res.status === "success") {
                setDepositMethods(res.paymentMethod);
              } else {
                setDepositMethods([]);
              }
            })
            .catch(() => setDepositMethods([]));
        } else {
          // Token invalid -> Redirect to login
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch(() => {
        // Verification failed -> Redirect to login
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  // Persist token when changed
  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, updateToken, depositMethods }}>
      {children}
    </AuthContext.Provider>
  );
}


