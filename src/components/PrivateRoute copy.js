import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../pages/Loading"; 
import { verifyToken } from "../api/auth"; 

const PrivateRoute = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        console.log("No token found. Redirecting...");
        return;
      }

      try {
        const response = await verifyToken(token);
        if (response?.data?.type === "valid") {
          console.log("Token is valid.");
          setLoading(false);
        } else {
          console.log("Token is invalid. Redirecting...");
          localStorage.removeItem("token");
          navigate("/login", { state: { message: "Session expired. Please login again." } });
        }
      } catch (error) {
        console.log("Error verifying token:", error);
        localStorage.removeItem("token");
        navigate("/login", { state: { message: "Session expired. Please login again." } });
      }
    };

    checkAuth();
  }, [location.pathname]); // Runs when the route changes

  if (loading) {
    return (
      <div className="loading-container">
        <Loading />
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
