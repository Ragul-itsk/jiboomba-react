import { useContext , useEffect} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {

   const { user, token } = useContext(AuthContext);
  
    useEffect(() => {
      if (!token) {
      
      }
    }, [token]);
  
    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
