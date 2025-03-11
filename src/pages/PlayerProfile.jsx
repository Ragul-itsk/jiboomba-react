// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Layout from "./Layout";

// export default function PlayerProfile() {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <p>Loading player details...</p>;
//   }

//   return (
//     <Layout>
//     <div className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg">
//     <h2 className="text-xl font-bold">Player Profile</h2>
//       <p><strong>Name:</strong> {user.player.name}</p>
//       <p><strong>Email:</strong> {user.player.email || "Not Provided"}</p>
//       <p><strong>Mobile:</strong> {user.player.mobile}</p>
//       <p><strong>Chips:</strong> {user.player.chips || "0"}</p>
//       <p><strong>Created At:</strong> {new Date(user.player.created_at).toLocaleString()}</p>
//       <p><strong>Updated At:</strong> {new Date(user.player.updated_at).toLocaleString()}</p>
      
//     </div>  
//     </Layout>
//   );
// }

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "./Layout";

export default function PlayerProfile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg text-gray-600">Loading player details...</p>
    </div>;
  }

  return (
    <Layout>
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mt-10">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
      Player Profile
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-700">Name:</span>
        <span className="text-gray-900">{user.player.name}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-700">Email:</span>
        <span className="text-gray-900">{user.player.email || "Not Provided"}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-700">Mobile:</span>
        <span className="text-gray-900">{user.player.mobile}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-700">Chips:</span>
        <span className="text-gray-900">{user.player.chips || "0"}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-700">Created At:</span>
        <span className="text-gray-900">{new Date(user.player.created_at).toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-gray-700">Updated At:</span>
        <span className="text-gray-900">{new Date(user.player.updated_at).toLocaleString()}</span>
      </div>
    </div>
  </div>
</div>

    </Layout>
  );
}

