import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  login,
  getProfile,
  authenticationType,
  authenticationOtpVerify,
  resendOtp
} from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("login");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");
  const [loginData, setLoginData] = useState(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [staticOPT, setstaticOPT] = useState(false);
  const [staticOTP, setStaticOTP] = useState("");
  const [timer, setTimer] = useState(600); 
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const { setUser, updateToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchLoginType = async () => {
      try {
        const data = await authenticationType();
        setLoginData(data);

        if (["static_otp", "otp"].includes(data?.type)) {
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
    setErrors("");

    try {
      if (otpRequired) {
        // If OTP is required, first send OTP
        const res = await login({ mobile, type });
        console.log(res);
        if (res.status === "success") {
          setOtpSent(true);
          setstaticOPT(res.otp);
          const expiryTimeInSeconds = res.expiary?.time * 60 || 60;
          setTimer(expiryTimeInSeconds);
          // setTimer(60); 
          setResendEnabled(false);
        } else if (res.status === "error") {
          console.log("insied");
          if (res.errors) {
            const fieldErrors = {};
            Object.entries(res.errors[0]).forEach(([key, value]) => {
              console.log("key:", key, "value:", value);
              fieldErrors[key] = value; // Assign key-value pair correctly
            });

            setErrors(fieldErrors);
          }
        } else {
          setErrors("Failed to send OTP");
        }
      } else {
        // Static login with password
        const res = await login({ mobile, password, type });

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
      setErrors("Invalid credentials");
    }
  };

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
  
      return () => clearInterval(countdown);
    }
  
    if (timer === 0) {
      setResendEnabled(true);
    }
  }, [otpSent, timer]);
  
  useEffect(() => {
    if (!otpSent) {
      setTimer(600); // Reset timer when OTP is not sent
    }
  }, [otpSent]);
  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      // Call API to verify OTP
      const res = await authenticationOtpVerify({ mobile, otp, type });

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
        setErrors("Invalid OTP, please try again.");
      }
    } catch (err) {
      setErrors("Invalid OTP, please try again.");
    }
  };


  
  const handleResendOtp = async () => {
    setErrors(""); 
    try {
      const res = await resendOtp({ mobile,  type,  });
      if (res.status === "success") {
        setStaticOTP(res.otp);
        const expiryTimeInSeconds = res.expiary?.time * 60 || 60;
        setTimer(expiryTimeInSeconds);
        setResendEnabled(false);
      } else {
        setErrors("Failed to resend OTP, try again.");
      }
    } catch (err) {
      setErrors("Failed to resend OTP, try again.");
    }
  };
  //  new code

  return (
    <>
      {loginData?.type === "default" && (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            {message && (
              <p className="error text-red-600 text-center mb-4">{message}</p>
            )}
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="hidden"
                placeholder="Type"
                value="login"
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

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
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
              <Link to="/forgot-password" className="flex justify-end">
                <p className="text-blue-500 hover:text-blue-700">
                  Forgot Password?
                </p>
              </Link>
            </form>
          </div>
        </div>
      )}

      {/* OTP Login - Mobile Input */}
      {(loginData?.type === "otp" || loginData?.type === "static_otp") &&
        !otpSent && (
          <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              {message && (
                <p className="error text-red-600 text-center mb-4">{message}</p>
              )}
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                Login
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="hidden"
                  placeholder="Type"
                  value="login"
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm text-center">
                    {errors.mobile}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        )}

      {/* OTP Verification Form - Only Shows After OTP is Sent */}
      {otpSent && (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            {message && (
              <p className="error text-red-600 text-center mb-4">{message}</p>
            )}
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              Login
            </h2>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              {loginData?.type === "static_otp" && (
                <p className="text-center text-green-500">
                  Eg OTP: {staticOPT}
                </p>
              )}

              <input
                type="hidden"
                placeholder="Type"
                value="login"
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm text-center">{errors.otp}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Verify OTP & Login
              </button>
              <p className="text-center text-gray-500 mt-2">
                Time <span className="font-bold">{Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</span>
              </p>
              {resendEnabled && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full mt-2 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                  Resend OTP
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

