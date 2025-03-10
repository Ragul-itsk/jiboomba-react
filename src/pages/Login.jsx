import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../api/auth";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext); // Get setUser & setToken from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ mobile, password });
      localStorage.setItem("token", res.token);
      setToken(res.token); // Now defined
      const userProfile = await getProfile(res.token);
      setUser(userProfile.data); // Now defined
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>   
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Mobile" onChange={(e) => setMobile(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
