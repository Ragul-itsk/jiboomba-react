import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PlayerProfile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading player details...</p>;
  }

  return (
    <div>
      <h2>Player Profile</h2>
      <p><strong>Name:</strong> {user.player.name}</p>
      <p><strong>Email:</strong> {user.player.email || "Not Provided"}</p>
      <p><strong>Mobile:</strong> {user.player.mobile}</p>
      <p><strong>Chips:</strong> {user.player.chips || "0"}</p>
      <p><strong>Created At:</strong> {new Date(user.player.created_at).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(user.player.updated_at).toLocaleString()}</p>
      
    </div>
  );
}
