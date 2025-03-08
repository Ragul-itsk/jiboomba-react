import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <p>Loading...</p>; // Prevents immediate redirection
  }
  
  console.log("User Data:", user); 

  return user ? (
    <div>
      <h1>Welcome {user.player.name}</h1>
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
