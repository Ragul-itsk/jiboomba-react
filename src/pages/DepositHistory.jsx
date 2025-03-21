import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { depositHistory } from "../api/deposit";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { FaRegEye } from "react-icons/fa";

const API_URL = "https://staging.syscorp.in/api/v1/jiboomba";

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
        {/* <h2>Deposit History</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {playerName && <h3>Player Name: {playerName}</h3>}

            <table border="1">
                <thead>
                    <tr>
                        <th>Player ID</th>
                        <th>Amount</th>
                        <th>UTR</th>
                        <th>Bonus</th>
                        <th>Image</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {depositHistoryData.length > 0 ? (
                        depositHistoryData.map((deposit, index) => (
                            <tr key={index}>
                                <td>{deposit.player_id}</td>
                                <td>{deposit.amount}</td>
                                <td>{deposit.utr}</td>
                                <td>{deposit.bonus || "N/A"}</td>
                                <td>
                                    {deposit.image ? (
                                        <img src={`https://staging.syscorp.in/storage/${deposit.image}`} alt="Deposit" width="50" />
                                       
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{deposit.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No deposit history available.</td>
                        </tr>
                    )}
                </tbody>
            </table> */}
        {/* <div className="relative flex items-center justify-between p-4 text-white">
          <button onClick={() => navigate(-1)}>&#8592; Back</button>
          <h2 className="text-lg font-semibold">Deposit</h2>
          <button onClick={() => navigate(-1)}>Close</button>
        </div> */}

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
                  <div className  ="flex items-center">UTR</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Image</div>
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
                      <p className="bg-green-500 text-white text-center p-1 rounded">
                        {deposit.status}
                      </p>
                    </th>
                    <td className="px-6 py-4">{deposit.amount}</td>
                    <td className="px-6 py-4">{deposit.utr}</td>
                    <td className="px-6 py-4">
                      {deposit.image ? (
                        <button
                          onClick={() =>
                            setSelectedImage(
                              `https://staging.syscorp.in/storage/${deposit.image}`
                            )
                          }
                        >
                          <FaRegEye className="w-6 h-6 text-blue-500" />
                        </button>
                      ) : (
                        "No Image"
                      )}
                    </td>
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
