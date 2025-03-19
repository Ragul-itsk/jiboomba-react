
  import { useState, useContext, useEffect } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { login, getProfile, authenticationType, loginOtpVerify } from "../api/auth";
  import { AuthContext } from "../context/AuthContext";

  export default function Login() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState(null);
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [staticOPT, setstaticOPT] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();
      const message = location.state?.message;
      const { setUser, updateToken } = useContext(AuthContext);
      

      useEffect(() => {
        const fetchLoginType = async () => {
          try {
            const data = await authenticationType();
            setLoginData(data);
            
            if (['static_otp', 'OTP'].includes(data?.type)) {
              setOtpRequired(true);
          }
          
        } catch (error) {
          console.error("Error fetching login type", error);
        }
      };

      fetchLoginType();
    }, []);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");

      try {
        if (otpRequired) {
          // If OTP is required, first send OTP
          const res = await login({ mobile }); 
          if (res.status === "success") {
            setOtpSent(true);
            // console.log('fdd',res.OTP);
            setstaticOPT(res.OTP) ;       
          } else {
            setError("Failed to send OTP");
          }
        } else {
          // Static login with password
          const res = await login({ mobile, password });

          if (!res || !res.token) {
            throw new Error("Invalid credentials");
          }

          localStorage.setItem("token", res.token);
          updateToken(res.token);

          const userProfile = await getProfile(res.token);
          if (!userProfile || !userProfile.data) {
            throw new Error("Failed to fetch user profile");
          }

          setUser(userProfile.data);
          navigate("/dashboard");
        }
      } catch (err) {
        setError("Invalid credentials");
      }
    };

    const handleOtpSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
        // Call API to verify OTP
        const res = await loginOtpVerify({ mobile, otp });
        
        if (res?.token) {
          localStorage.setItem("token", res.token);
          updateToken(res.token);

          const userProfile = await getProfile(res.token);
          if (!userProfile || !userProfile.data) {
            throw new Error("Failed to fetch user profile");
          }

          setUser(userProfile.data);
          navigate("/dashboard");
        } else {
          setError("Invalid OTP, please try again.");
        }
      } catch (err) {
        setError("Invalid OTP, please try again.");
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          {message && <p className="error text-red-600 text-center mb-4">{message}</p>}
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

          {!otpSent ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!otpRequired && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                {otpRequired ? "Send OTP" : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
                {otpSent && loginData?.type === "static_otp" && (
  <p className="text-center text-green-500">Eg OTP: {staticOPT}</p>
)}

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Verify OTP & Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

