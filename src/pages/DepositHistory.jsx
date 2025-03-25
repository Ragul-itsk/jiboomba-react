import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { depositHistory } from "../api/deposit";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { FaRegEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = "https://staging.syscorp.in/api/v1/starbuks";

export default function ListBank() {
  const { token } = useContext(AuthContext);
  const [depositHistoryData, setDepositHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchDepositHistory();
  }, [token]);

  const fetchDepositHistory = async () => {
    if (!token) return;
    try {
      const response = await depositHistory(token);
      if (response && response.status === "success") {
        setDepositHistoryData(response.depositHistory || []);

        // Extract player name from `msg` field
        const nameFromMsg = response.msg.split(" ")[0]; // "Mohan deposit history."
        setPlayerName(nameFromMsg);
      } else {
        setDepositHistoryData([]);
        setError("No deposit history found.");
      }
    } catch (err) {
      console.error("Error fetching deposit history:", err);
      setError("Failed to fetch deposit history.");
    } finally {
      setLoading(false);
    }
  };
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <Layout>
      <div>
        <div className="relative ">
          <div className="flex items-center justify-between mb-4 relative ">
            <button onClick={() => navigate(-1)}>
              <IoMdArrowRoundBack size={18} />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold">Deposit</h2>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Amount</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">UTR</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Image</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Remarks</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {depositHistoryData.length > 0 ? (
                depositHistoryData.map((deposit, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-3 py-4 whitespace-nowrap text-sm font-medium"
                    >
                      <p
                        className={`text-white text-center p-1 rounded ${
                          deposit.status === "pending"
                            ? "bg-orange-500"
                            : deposit.status === "processing"
                            ? "bg-yellow-500"
                            : deposit.status === "verified"
                            ? "bg-green-500"
                            : deposit.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-500" // Default color if status is unknown
                        }`}
                      >
                        {deposit.status}
                      </p>
                    </th>
                    <td className="px-6 py-4">{deposit.amount}</td>
                    <td className="px-6 py-4">{deposit.utr}</td>
                    <td className="px-6 py-4">
                      {deposit.image ? (
                        <button
                          onClick={() => setSelectedImage(`${deposit.image}`)}
                        >
                          <FaRegEye className="w-6 h-6 text-blue-500" />
                        </button>
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{deposit.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No deposit history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Image Popup Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-scroll">
              <div className="bg-white p-4 rounded shadow-lg">
                <img
                  src={selectedImage}
                  alt="Deposit"
                  className="h-svh max-h-screen w-auto"
                />
                <button
                  className="mt-2 p-2 bg-red-500 text-white rounded"
                  onClick={() => setSelectedImage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
