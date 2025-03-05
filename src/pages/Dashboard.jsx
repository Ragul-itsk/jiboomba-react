import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return user ? (
    <div>
      <h1>Welcome {user.name}</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
