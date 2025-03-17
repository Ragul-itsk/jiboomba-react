// import { useContext, useEffect, } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = () => {
//   const {token } = useContext(AuthContext);

//   console.log('token',token)

//   useEffect(() => {
//     if (!token) {

//     }
//   }, [token]);

//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;

import { useContext, useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { token } = useContext(AuthContext);
  const loggedOnce = useRef(false);

  useEffect(() => {
    if (!loggedOnce.current) {
      console.log("token", token);
      loggedOnce.current = true;
    }
  }, [token]);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

