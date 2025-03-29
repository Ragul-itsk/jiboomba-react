
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return < Outlet/>;
};

export default PublicRoute;

