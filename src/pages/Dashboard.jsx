import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <p className="text-gray-600">ID: {user.player.id}</p>
          <p className="text-gray-600">Balance: ${user.player.balance}</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded mt-4">Deposit</button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="w-64 bg-white h-full shadow-lg p-4 flex flex-col">
          <button
            className="self-end text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
          <div className="text-center mt-4">
            <h2 className="text-lg font-bold">{user.player.name}</h2>
            <p className="text-gray-600">Balance: ${user.player.balance}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">Deposit</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-40 pb-16 p-4"> {/* Padding for fixed header and bottom menu */}
        {/* Sliding Banner */}
        <div className="mt-6 overflow-hidden">
          <div className="whitespace-nowrap animate-slide">
            <span className="inline-block bg-yellow-400 px-6 py-2 rounded-full text-black mr-4">Exclusive Bonuses!</span>
            <span className="inline-block bg-red-400 px-6 py-2 rounded-full text-white mr-4">Big Wins Await!</span>
            <span className="inline-block bg-blue-400 px-6 py-2 rounded-full text-white">New Games Added!</span>
          </div>
        </div>

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
