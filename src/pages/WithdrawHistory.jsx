import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { withdrawHistory } from "../api/withdraw";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { FaRegEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { BASE_URL } from "../config/apiConfig";

export default function WithdrawList() {
  const { token } = useContext(AuthContext);
  const [withdrawHistoryData, setWithdrawHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithdrawHistory();
  }, [token]);

  const fetchWithdrawHistory = async () => {
    if (!token) return;
    try {
      const response = await withdrawHistory(token);
      if (response && response.status === "success") {
        setWithdrawHistoryData(response.withdrawHistory || []);

        // Extract player name from `msg` field
        const nameFromMsg = response.msg.split(" ")[0]; // "Mohan deposit history."
        setPlayerName(nameFromMsg);
      } else {
        setWithdrawHistoryData([]);
        setError("No withdraw history found.");
      }
    } catch (err) {
      console.error("Error fetching withdraw history:", err);
      setError("Failed to fetch withdraw history.");
    } finally {
      setLoading(false);
    }
  };

  const cancelWithdraw = async (withdrawId) => {
    if (!token) {
      alert("Unauthorized: No token provided.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/player/cancel-withdraw`, {
        params: { withdraw_id: withdrawId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        alert("Withdraw request canceled successfully.");
        fetchWithdrawHistory(); // Refresh data
      } else {
        alert(response.data.message || "Failed to cancel withdraw request.");
      }
    } catch (error) {
      console.error("Error canceling withdraw:", error);
      alert("Error canceling withdraw request. Please try again.");
    }
  };

  return (
    <Layout>
      <div>
        <div className="relative ">
          <div className="flex items-center justify-between mb-4 relative ">
            <button onClick={() => navigate(-1)}>
              <IoMdArrowRoundBack size={18} />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold">Withdraw</h2>
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
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {withdrawHistoryData.length > 0 ? (
                withdrawHistoryData.map((withdraw, index) => (
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
                          withdraw.status === "pending"
                            ? "bg-orange-500"
                            : withdraw.status === "processing"
                            ? "bg-yellow-500"
                            : withdraw.status === "verified"
                            ? "bg-green-500"
                            : withdraw.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {withdraw.status}
                      </p>
                    </th>
                    <td>{withdraw.amount}</td>
                    <td className="text-red-500">
                      <button onClick={() => cancelWithdraw(withdraw.id)}>
                        <MdCancel className="m-auto" size={20} />
                      </button>
                    </td>
                    <td>{withdraw.remarks || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No withdraw history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
