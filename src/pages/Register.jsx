  // import { useState } from "react";
  // import { useNavigate } from "react-router-dom";
  // import { register } from "../api/auth";

  // export default function Register() {
  //   const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });
  //   const [error, setError] = useState("");
  //   const navigate = useNavigate();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await register({ ...formData, portal_slug: "jiboomba" });
  //       if (response.status === "error") {
  //         setError(response.msg);
  //       }
  //       if(response.status === "success"){
  //         localStorage.setItem("token", response.token);
  //       navigate('/dashboard');
  //       }else{
  //       setError("Something went wrong!");

  //       }
  //     } catch (err) {   
          
  //       setError("Registration failed!");
  //     }
  //   };

  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
  //       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
  //         <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Register</h2>
  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <input
  //             type="text"
  //             placeholder="Name"
  //             value={formData.name}
  //             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //             required
  //             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           <input
  //             type="email"
  //             placeholder="Email"
  //             value={formData.email}
  //             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  //             required
  //             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           <input
  //             type="text"
  //             placeholder="Mobile"
  //             value={formData.mobile}
  //             onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
  //             required
  //             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           <input
  //             type="password"
  //             placeholder="Password"
  //             value={formData.password}
  //             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  //             required
  //             className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  //           <button
  //             type="submit"
  //             className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
  //           >
  //             Register
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // }


    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { register } from "../api/auth";

    export default function Register() {
      const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });
      const [error, setError] = useState("");
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
          const response = await register({ ...formData, portal_slug: "jiboomba" });

          if (response.status === "error") {
            setError(response.msg || "Registration failed!");
            return;
          }

          if (response.status === "success") {
            localStorage.setItem("token", response.token);
            navigate('/dashboard');
            setTimeout(() => window.location.reload(), 500);
          } else {
            setError("Something went wrong!");
          }
        } catch (err) {
          setError(err.response?.data?.msg || "Registration failed!");
        }
      };

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      );
    }

