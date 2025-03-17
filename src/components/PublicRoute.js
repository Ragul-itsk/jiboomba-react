// import { useContext , useEffect} from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PublicRoute = () => {

//    const { user, token } = useContext(AuthContext);
  
//     useEffect(() => {
//       if (!token) {
      
//       }
//     }, [token]);
  
//     return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
// };

// export default PublicRoute;

import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
    const {token } = useContext(AuthContext);
    const location = useLocation();

    // If user is logged in, prevent access to public routes like "/" and "/login"
    if (token) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;

