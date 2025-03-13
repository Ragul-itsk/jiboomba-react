import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
    
    }
  }, [token]);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
