import { useState, useContext } from "react";
import { useNavigate,useLocation  } from "react-router-dom";
import { login, getProfile } from "../api/auth";
import { AuthContext } from "../context/AuthContext"; 

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const { setUser, updateToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const res = await login({ mobile, password });
  
      if (!res || !res.token) {
        throw new Error("Invalid response from server");
      }
  
      localStorage.setItem("token", res.token);
      updateToken(res.token); 
  
      const userProfile = await getProfile(res.token);
      if (!userProfile || !userProfile.data) {
        throw new Error("Failed to fetch user profile");
      }
  
      setUser(userProfile.data);
      navigate("/dashboard");
    } catch (err) { 
      setError("Invalid credentials"); 
    }
  };

  return (
    <>
    
    <div>
      {/* Login Form */}
    </div>
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      {message && <p className="error text-red-600 text-center mb-4">{message}</p>}

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
