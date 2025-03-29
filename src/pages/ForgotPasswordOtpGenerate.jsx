
// import { useState,useEffect} from "react";
// import { forgotPasswordOtpGenerate, forgotPasswordOtpVerify,newPasswordCreate,resendOtp } from "../api/auth"; // Import reset function
// import { useNavigate } from "react-router-dom";

// const ForgotPasswordRequest = () => {
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [type, setType] = useState("forgot_password");
//   const [otpSent, setOtpSent] = useState(false);
//   const [password, setPassword] = useState("");
//   const [password_confirmation  , setConfirmPassword] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [staticOPT, setstaticOPT] = useState(false);
//     const [staticOTP, setStaticOTP] = useState("");
//   const [error, setError] = useState("");
//   const [timer, setTimer] = useState(600); 
//   const [resendEnabled, setResendEnabled] = useState(false);
//   const navigate = useNavigate();

//   // Function to request OTP
//   const handleRequestOtp = async (e) => {
//     e.preventDefault();
//     if (!mobile) {
//       setError("Mobile number is required");
//       return;
//     }

//     try {
//       const res = await forgotPasswordOtpGenerate({ mobile });
//       console.log(res.data);
//       setIsOtpSent(true);
//       const expiryTimeInSeconds = res.expiary?.time * 60 || 60;
//           setTimer(expiryTimeInSeconds);
//           setResendEnabled(false);
//       setError(""); 
//     } catch (error) {
//       setError(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   // Function to verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) {
//       setError("Please enter the OTP");
//       return;
//     }

//     try {
//       const response = await forgotPasswordOtpVerify({ mobile, otp });
//       console.log(response);
//       setIsOtpVerified(true); // Move to the next step (password reset form)
//       setError("");
//     } catch (error) {
//       setError(error.message || "Invalid OTP");
//     }
//   };

//   // Function to reset password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!password || !password_confirmation ) {
//       setError("Both fields are required");
//       return;
//     }
//     if (password !== password_confirmation  ) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await newPasswordCreate({ mobile, password, password_confirmation});
//       console.log(response);
//       navigate("/login"); // Redirect to login after successful reset
//     } catch (error) {
//       setError(error.message || "Failed to reset password");
//     }
//   };
//   useEffect(() => {
//       if (otpSent && timer > 0) {
//         const countdown = setInterval(() => {
//           setTimer((prev) => prev - 1);
//         }, 1000);
    
//         return () => clearInterval(countdown);
//       }
    
//       if (timer === 0) {
//         setResendEnabled(true);
//       }
//     }, [otpSent, timer]);
    
//     useEffect(() => {
//       if (!otpSent) {
//         setTimer(600); // Reset timer when OTP is not sent
//       }
//     }, [otpSent]);

//     const handleResendOtp = async () => {
//         setError(""); 
//         try {
//           const res = await resendOtp({ mobile,  type,  });
//           if (res.status === "success") {
//             setStaticOTP(res.otp);
//             const expiryTimeInSeconds = res.expiary?.time * 60 || 60;
//             setTimer(expiryTimeInSeconds);
//             setResendEnabled(false);
//           } else {
//             setError("Failed to resend OTP, try again.");
//           }
//         } catch (err) {
//           setError("Failed to resend OTP, try again.");
//         }
//       };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}

//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
//           {isOtpVerified ? "Reset Password" : isOtpSent ? "Enter OTP" : "Forgot Password"}
//         </h2>

//         {!isOtpSent ? (
//           // Step 1: Request OTP
//           <form onSubmit={handleRequestOtp} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
//             >
//               Send OTP
//             </button>
//           </form>
//         ) : !isOtpVerified ? (
//           // Step 2: Verify OTP
//           <form onSubmit={handleVerifyOtp} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
//             >
//               Verify OTP
//             </button>

//             <p className="text-center text-gray-500 mt-2">
//                 Time <span className="font-bold">{Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</span>
//               </p>
//               {resendEnabled && (
//                 <button
//                   type="button"
//                   onClick={handleResendOtp}
//                   className="w-full mt-2 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
//                 >
//                   Resend OTP
//                 </button>
//               )}
//           </form>
//         ) : (
//           // Step 3: Reset Password
//           <form onSubmit={handleResetPassword} className="space-y-4">
//             <input
//               type="hidden"
//               placeholder="Enter Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Enter New Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Confirm New Password"
//               value={password_confirmation  }
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
//             >
//               Reset Password
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordRequest;


import { useState, useEffect } from "react";
import { forgotPasswordOtpGenerate, forgotPasswordOtpVerify, newPasswordCreate, resendOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";

const ForgotPasswordRequest = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [type, setType] = useState("forgot_password");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(600);
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();

  // Function to request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!mobile) {
      setError("Mobile number is required");
      return;
    }

    try {
      const res = await forgotPasswordOtpGenerate({ mobile });
      console.log(res.data);
      setIsOtpSent(true);
      setError(""); 
      setTimer(res?.expiary?.time * 60 || 600); // Reset timer
      setResendEnabled(false);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      const response = await forgotPasswordOtpVerify({ mobile, otp });
      console.log(response);
      setIsOtpVerified(true);
      setError("");
    } catch (error) {
      setError(error.message || "Invalid OTP");
    }
  };

  // Function to reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !password_confirmation) {
      setError("Both fields are required");
      return;
    }
    if (password !== password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await newPasswordCreate({ mobile, password, password_confirmation });
      console.log(response);
      navigate("/login"); // Redirect to login after successful reset
    } catch (error) {
      setError(error.message || "Failed to reset password");
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
    if (timer === 0) {
      setResendEnabled(true);
    }
  }, [isOtpSent, timer]);

  // Function to handle OTP Resend
  const handleResendOtp = async () => {
    setError("");
    try {
      const res = await resendOtp({ mobile, type });
      if (res.status === "success") {
        setTimer(res?.expiary?.time * 60 || 600);
        setResendEnabled(false);
      } else {
        setError("Failed to resend OTP, try again.");
      }
    } catch (err) {
      setError("Failed to resend OTP, try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isOtpVerified ? "Reset Password" : isOtpSent ? "Enter OTP" : "Forgot Password"}
        </h2>

        {!isOtpSent ? (
          // Step 1: Request OTP
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        ) : !isOtpVerified ? (
          // Step 2: Verify OTP
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            >
              Verify OTP
            </button>

            <p className="text-center text-gray-500 mt-2">
              Time Left: <span className="font-bold">{Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</span>
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
        ) : (
          // Step 3: Reset Password
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={password_confirmation}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;



