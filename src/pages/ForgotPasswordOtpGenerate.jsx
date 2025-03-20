
//   import { useState } from "react";
// import { forgotPasswordOtpGenerate, forgotPasswordOtpVerify } from "../api/auth"; // Import verify function
// import { useNavigate } from "react-router-dom";

// const ForgotPasswordRequest = () => {
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Function to request OTP
//   const handleRequestOtp = async (e) => {
//     e.preventDefault();
//     if (!mobile) {
//       setError("Mobile number is required");
//       return;
//     }

//     try {
//       const response = await forgotPasswordOtpGenerate({ mobile });
//       console.log(response.data);
//       setIsOtpSent(true); // Set OTP sent state to true
//       setError(""); // Clear any previous error
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
//       const response = await forgotPasswordOtpVerify({ mobile, otp }); // Call verify function
//       console.log(response);
//       navigate(`/reset-password?mobile=${mobile}`); // Redirect to reset password page
//     } catch (error) {
//       setError(error.message || "Invalid OTP");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
//           {isOtpSent ? "Enter OTP" : "Forgot Password"}
//         </h2>

//         {!isOtpSent ? (
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
//         ) : (
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
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordRequest;



import { useState } from "react";
import { forgotPasswordOtpGenerate, forgotPasswordOtpVerify,newPasswordCreate } from "../api/auth"; // Import reset function
import { useNavigate } from "react-router-dom";

const ForgotPasswordRequest = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation  , setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!mobile) {
      setError("Mobile number is required");
      return;
    }

    try {
      const response = await forgotPasswordOtpGenerate({ mobile });
      console.log(response.data);
      setIsOtpSent(true);
      setError(""); // Clear any previous error
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
      setIsOtpVerified(true); // Move to the next step (password reset form)
      setError("");
    } catch (error) {
      setError(error.message || "Invalid OTP");
    }
  };

  // Function to reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !password_confirmation ) {
      setError("Both fields are required");
      return;
    }
    if (password !== password_confirmation  ) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await newPasswordCreate({ mobile, password, password_confirmation});
      console.log(response);
      navigate("/login"); // Redirect to login after successful reset
    } catch (error) {
      setError(error.message || "Failed to reset password");
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
          </form>
        ) : (
          // Step 3: Reset Password
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="hidden"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              value={password_confirmation  }
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


