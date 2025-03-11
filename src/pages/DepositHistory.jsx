import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { depositHistory } from "../api/deposit";
import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/jiboomba";

export default function ListBank() {
    const { token } = useContext(AuthContext);
    const [depositHistoryData, setDepositHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playerName, setPlayerName] = useState("");

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

    return (
        <div>
            <h2>Deposit History</h2>

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
            </table>
        </div>
    );
}
