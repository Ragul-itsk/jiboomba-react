

import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
    const {token } = useContext(AuthContext);
    const location = useLocation();

    if (token) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;

