import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  register,
  getProfile,
  authenticationType,
  authenticationOtpVerify,
} from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    player_name: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  const [type, setType] = useState("register");
  const [otp, setOtp] = useState("");
  const [staticOTP, setStaticOTP] = useState("");
  const [playerNameStatus, setPlayerNameStatus] = useState(null);
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
        setRegisterData(data);
        if (["static_otp", "otp"].includes(data?.type)) {
          setOtpRequired(true);
        }
      } catch (error) {
        console.error("Error fetching login type", error);
      }
    };
    fetchLoginType();
  }, []);

  useEffect(() => {
    if (formData.player_name.length >= 3) {
      const checkPlayerName = async () => {
        try {
          const response = await axios.get(
            `https://staging.syscorp.in/api/v1/starbuks/check-player-name?player_name=${formData.player_name}`
          );
          if (response.data.status === "success") {
            setPlayerNameStatus("Available");
          } else if (response.data.status === "failed") {
            setPlayerNameStatus("Name is already taken");
          }
        } catch (error) {
          console.error("Error checking player name", error);
          setPlayerNameStatus("Player name already exists.");
        }
      };

      checkPlayerName();
    } else {
      setPlayerNameStatus(null);
    }
  }, [formData.player_name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (otpRequired) {
        const res = await register({
          mobile: formData.mobile,
          player_name: formData.player_name,
          type,
          portal_slug: "starbuks",
        });
        console.log("register", res);
        if (res.status === "success") {
          setOtpSent(true);
          setStaticOTP(res.otp);
          setTimer(600);
          setResendEnabled(false);
        } else if (res.status === "error") {
          console.log("error messages", Object.values(res.errors[0]));
          setError(Object.values(res.errors[0]));
        } else {
          setError("Somethink went wrong");
        }
      } else {
        const res = await register({
          ...formData,
          portal_slug: "starbuks",
          type,
        });
        if (!res || !res.token)
          throw new Error("This mobile is already exist in this Portal.");

        localStorage.setItem("token", res.token);
        updateToken(res.token);

        const userProfile = await getProfile(res.token);
        if (!userProfile || !userProfile.data)
          throw new Error("Failed to fetch user profile");

        setUser(userProfile.data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("This mobile is already exist in this Portal.");
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authenticationOtpVerify({
        mobile: formData.mobile,
        otp,
        type,
      });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        updateToken(res.token);

        const userProfile = await getProfile(res.token);
        if (!userProfile || !userProfile.data)
          throw new Error("Failed to fetch user profile");

        setUser(userProfile.data);
        navigate("/dashboard");
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (err) {
      setError("Invalid OTP, please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      const res = await register({
        mobile: formData.mobile,
        player_name: formData.player_name,
        type,
        portal_slug: "starbuks",
      });
      if (res.status === "success") {
        setStaticOTP(res.otp);
        setTimer(600); // Restart 10-minute timer
        setResendEnabled(false);
      } else {
        setError("Failed to resend OTP, try again.");
      }
    } catch (err) {
      setError("Failed to resend OTP, try again.");
    }
  };

  return (
    <>
      {registerData?.type === "default" && (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {playerNameStatus && (
                <p
                  className={`text-md text-end ${
                    playerNameStatus === "Available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {playerNameStatus}
                </p>
              )}
              <input
                type="text"
                placeholder="Name"
                value={formData.player_name}
                onChange={(e) =>
                  setFormData({ ...formData, player_name: e.target.value })
                }
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              />
              {/* {playerNameStatus && <p className="text-sm text-center">{playerNameStatus}</p>} */}
              <input
                type="text"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}

      {(registerData?.type === "otp" || registerData?.type === "static_otp") &&
        !otpSent && (
          <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                Register
              </h2>
              {playerNameStatus && (
                <p
                  className={`text-md text-end ${
                    playerNameStatus === "Available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {playerNameStatus}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.player_name}
                  onChange={(e) =>
                    setFormData({ ...formData, player_name: e.target.value })
                  }
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="text"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
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

      {otpSent && (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            {message && (
              <p className="text-red-600 text-center mb-4">{message}</p>
            )}
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              Verify OTP
            </h2>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              {registerData?.type === "static_otp" && (
                <p className="text-center text-green-500">
                  Example OTP: {staticOTP}
                </p>
              )}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Verify OTP & Login
              </button>

              <p className="text-center text-gray-500 mt-2">
                Time{" "}
                <span className="font-bold">
                  {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                </span>
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
