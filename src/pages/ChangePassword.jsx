import { useState, useEffect, useContext } from "react";
import { newPasswordCreate } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/v1/jiboomba";

const ChangePasswordRequest = () => {
  const [mobile, setMobile] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);  

  const navigate = useNavigate();

  // Function to verify token and get user details
  const verifyToken = async (userToken) => {
    try {
      const response = await axios.get(`${API_URL}/player/verify-token`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      return response.data;
    } catch (error) {
      console.error("Token Verification Error:", error.response?.data || error);
      throw error.response?.data || { message: "Token verification failed" };
    }
  };

  // Fetch user mobile from token when component loads
  useEffect(() => {
    if (!token) {
      setError("User is not authenticated. Please login.");
      return;
    }

    const fetchUserMobile = async () => {
      try {
        const response = await verifyToken(token);
        console.log("Token Response:", response);

        if (response.status === "success" && response.user?.mobile) {
          setMobile(response.user.mobile);
        } else {
          setError("Invalid token or unauthorized access.");
        }
      } catch (error) {
        setError(error.message || "Failed to verify token.");
      }
    };

    fetchUserMobile();
  }, [token]);

  // Function to reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await newPasswordCreate({
        mobile,
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,   
      });

      console.log("Password Change Response:", response);
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="hidden"
            placeholder="Enter Mobile Number"
            value={mobile}
            readOnly // Prevents user from editing mobile number
            className="w-full p-3 border rounded focus:outline-none bg-gray-200 cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordRequest;
