import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Welcome to Jiboomba React App</h1>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
}

export default App;
