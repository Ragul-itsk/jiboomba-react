import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate , Navigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleDepositClick = () => {
    // Navigate to the "/deposit-request" route
    
    navigate("/deposit-request");
  };
  if (user === null) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  console.log("User Data:", user);

  return user ? (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Top Navbar & Profile Info Fixed */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <header className="flex justify-between items-center bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-bold">Jiboomba</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            <FiMenu />
          </button>
        </header>
        <div className="bg-white shadow-md p-4 text-center">
          <h2 className="text-xl font-bold">Welcome, {user.player.name}!</h2>
          <p className="text-gray-600">Balance: {user.player.chips}</p>
          <button className="bg-green-500 text-white px-4 py-1 rounded mt-2" onClick={handleDepositClick}>Deposit</button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="w-100 bg-white h-full shadow-lg p-4 flex flex-col">
          <button
            className="self-end text-gray-600 mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
          <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <div class="flex justify-end px-4 pt-4">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
            <span class="sr-only">Open dropdown</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
        </button>
        {/* Profile */}
        <div id="dropdown" class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
            <ul class="py-2" aria-labelledby="dropdownButton">
            <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
            </li>
            </ul>
        </div>
    </div>
    <div class="flex flex-col items-center pb-10">
        <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="assets/images/sample-profile.png" alt="Profile Image"/>
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.player.name}</h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">{ user.player.chips }</span>
        <div class="flex mt-4 md:mt-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">Deposit</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded mt-2 ms-2">Withdraw</button>
        </div>
    </div>
</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-60 pb-16 p-4"> {/* Padding for fixed header and bottom menu */}
        {/* Sliding Banner */}
        {/* <div className="mt-6 overflow-hidden">
          <div className="whitespace-nowrap animate-slide">
            <span className="inline-block bg-yellow-400 px-6 py-2 rounded-full text-black mr-4">Exclusive Bonuses!</span>
            <span className="inline-block bg-red-400 px-6 py-2 rounded-full text-white mr-4">Big Wins Await!</span>
            <span className="inline-block bg-blue-400 px-6 py-2 rounded-full text-white">New Games Added!</span>
          </div>
        </div> */}

        {/* Game Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">🎲 Game 1</div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">🎰 Game 2</div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">🃏 Game 3</div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">⚽ Live Sports</div>
        </div>
      </div>

      {/* Bottom Navigation Fixed */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-3 flex justify-around z-10">
        <button className="text-blue-600 font-semibold">Home</button>
        <button className="text-gray-600">Live Games</button>
        <button className="text-gray-600">Casino</button>
      </nav>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
