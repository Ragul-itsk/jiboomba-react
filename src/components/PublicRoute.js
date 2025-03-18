

import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
    const location = useLocation();

    console.log('Checking authentication...');
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return < Outlet/>;
};

export default PublicRoute;

