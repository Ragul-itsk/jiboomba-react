import { div } from "framer-motion/client";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Slider from "react-slick";


function App() {
const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-gray-100 relative">
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-30">
                <header className="flex justify-between items-center bg-black p-4 text-white">
                  <h1 className="text-xl font-bold cursor-pointer">
                    Jiboomba
                  </h1>
                  <Link to="/login" className="button">
                  <button className="py-1 px-3 bg-white rounded-full shadow text-green-500 font-semibold">Login</button>
                  </Link>
                  <Link to="/register" className="button">
                  <button className="py-1 px-3 bg-yellow-500 rounded-full shadow text-white font-semibold">Register</button>
                  </Link>
                </header>
                 
        </div>              
      </div>

      </div>
  );
}

export default App;
 