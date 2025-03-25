// Layout.jsx
import { React, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { PiHandWithdraw, PiHandDeposit, PiPassword } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import { logout} from "../api/auth";


const Layout = ({ children }) => {
  // Get the current route/path
  const location = useLocation();

  const { user } = useContext(AuthContext);
  //  console.log("User Data:", user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleDepositClick = () => {
    // Navigate to the "/deposit-request" route

    navigate("/deposit-request");
  };
  if (user === null) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      await logout(token);
      localStorage.removeItem("token"); // Remove token after logout
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Top Navbar & Profile Info Fixed */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-30">
        <header className="flex justify-between items-center bg-blue-600 p-4 text-white">
          {/* <h1 className="text-xl font-bold">Jiboomba</h1> */}
          <h1 className="text-xl font-bold cursor-pointer"onClick={() => navigate("/dashboard")}>Jiboomba</h1>
          
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            <FiMenu />
          </button>
        </header>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-100 bg-white h-full shadow-lg p-4 flex flex-col overflow-y-scroll">
          <button
            className="self-end text-gray-600 mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
          {/* Profile model */}
          <div className="w-full max-w-llg bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-end px-4 pt-4">
              <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
              {/* Profile */}
              <div
                id="dropdown"
                className="hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
              >
                <ul className="py-2" aria-labelledby="dropdownButton">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Export Data
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center pb-10">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src="assets/images/sample-profile.png"
                alt="Profile Image"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {user.player.playername}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {/* {user.player.chips} */}
                <p className="text-gray-600">Chips: {user.player.chips}</p>
              </span>
              <div className="flex mt-4 md:mt-6">
                <Link to="/deposit-amount">
                <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                  Deposit
                </button>
                </Link>
                <Link to="/withdraw-amount">
                <button className="bg-red-500 text-white px-4 py-2 rounded mt-2 ms-2">
                  Withdraw
                </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full mt-5 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-m font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <GrTransaction size={32} className="p-1 mx-2" />
             Transactions
            </button>
<Link to="/statement">  
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-m font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <GrTransaction size={32} className="p-1 mx-2" />
             Statement
            </button>
            </Link>
            <Link to="/deposit-history">
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-m font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <PiHandDeposit size={32} className="p-1 mx-2" />
              Deposit History
            </button>
            </Link>
            <Link to="/withdraw-history">
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-m font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <PiHandWithdraw size={32} className="p-1 mx-2" />
              Withdraw History
            </button>
            </Link>
            <Link to="/change-password">
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-m font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <PiPassword size={32} className="p-1 mx-2" />
              Change Password
            </button>
            </Link>
            <button 
               onClick={handleLogout}
              // type="button"
              className="relative inline-flex items-center w-full px-4 py-4 text-red-600 text-m font-medium rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <CiLogout size={32} className="p-1 mx-2"/>
              
            Logout
          </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-16 p-4">
        {" "}
        {/* Padding for fixed header and bottom menu */}
        {/* Children */}
        {children}
      </div>

      {/* Bottom Navigation Fixed */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-3 flex justify-around z-10 border-t-4 border-indigo-500">
        <button className="text-blue-600 font-semibold" onClick={() => navigate("/dashboard")}>Home</button>
        <button className="text-gray-600">Live Games</button>
        <button className="text-gray-600">Casino</button>
      </nav>
    </div>
  );
};

export default Layout;
