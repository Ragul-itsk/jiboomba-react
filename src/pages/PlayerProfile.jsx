import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function PlayerProfile() {
  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext);


    if (user === null) {
      return <p className="text-center text-gray-500 mt-10">Loading...</p>;
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
              <span className="text-gray-900">{user?.player?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-900">{user?.player?.email || "Not Provided"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Mobile:</span>
              <span className="text-gray-900">{user?.player?.mobile || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Chips:</span>
              <span className="text-gray-900">{user?.player?.chips || "0"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-700">Created At:</span>
              <span className="text-gray-900">{user?.player?.created_at ? new Date(user.player.created_at).toLocaleString() : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Updated At:</span>
              <span className="text-gray-900">{user?.player?.updated_at ? new Date(user.player.updated_at).toLocaleString() : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
