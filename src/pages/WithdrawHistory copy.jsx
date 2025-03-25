import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { withdrawHistory } from "../api/withdraw";
import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/v1/starbuks";

export default function WithdrawList() {
  const { token } = useContext(AuthContext);
  const [withdrawHistoryData, setWithdrawHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");

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

  return (
    <div>
      <h2>Withdraw History</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {playerName && <h3>Player Name: {playerName}</h3>}

      <table border="1">
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Amount</th>
            <th>UTR</th>
            <th>Image</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {withdrawHistoryData.length > 0 ? (
            withdrawHistoryData.map((withdraw, index) => (
              <tr key={index}>
                <td>{withdraw.player_id}</td>
                <td>{withdraw.amount}</td>
                <td>{withdraw.utr}</td>
                <td>
                  {withdraw.image ? (
                    <img
                      src={`https://staging.syscorp.in/storage/${withdraw.image}`}
                      alt="Withdraw"
                      width="50"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{withdraw.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No withdraw history available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
