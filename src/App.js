import { Link } from "react-router-dom";


function App() {
  return (
      <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Welcome to Jiboomba
        </h1>
        <nav className="space-x-4">     
        <Link to="/login" className="button">
        <button className="py-3 px-8 bg-green-500 rounded shadow text-white">Login</button>
        </Link>
        <Link to="/register" className="button">
        <button className="py-3 px-8 bg-yellow-500 rounded shadow text-white">Register</button>
        </Link>
        </nav>
      </div>
  );
}

export default App;
