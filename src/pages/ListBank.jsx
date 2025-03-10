import { useEffect, useState, useContext } from "react";
import { getBank } from "../api/player_bank";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/jiboomba"; // Replace with actual API URL

export default function ListBank() {
    const { token } = useContext(AuthContext);
    const [bankDetails, setBankDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBankDetails();
    }, [token]);

    const fetchBankDetails = async () => {
        if (!token) return;
        try {
            const response = await getBank(token);
            if (response && response.status === "success") {
                setBankDetails(response.playerBank || []);
            } else {
                setBankDetails([]);
                setError("No bank details found.");
            }
        } catch (err) {
            console.error("Error fetching bank details:", err);
            setError("Failed to fetch bank details.");
        } finally {
            setLoading(false);
        }
    };

    const changeBankStatus = async (bankId, currentStatus) => {
        try {
            const newStatus = currentStatus === "1" ? "0" : "1"; // Toggle status
    
            const response = await axios.get(
                `${API_URL}/player/change-bank-status?bank_id=${bankId}&status=${newStatus}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.status === "success") {
                alert("Bank status updated successfully!");
                fetchBankDetails(); // Refresh the list after status change
            } else {
                alert("Failed to update bank status.");
            }
        } catch (error) {
            console.error("Error changing bank status:", error);
            alert("Error changing bank status.");
        }
    };

    const deleteBank = async (bankId) => {
        try {
            const response = await axios.get(
                `${API_URL}/player/delete-bank?bank_id=${bankId}&is_deleted=1`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === "success") {
                alert("Bank deleted successfully!");
                fetchBankDetails(); // Refresh the list after deletion
            } else {
                alert("Failed to delete bank.");
            }
        } catch (error) {
            console.error("Error deleting bank:", error);
            alert("Error deleting bank.");
        }
    };

        return (
            <div>
                <h2>Bank Details</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : bankDetails.length > 0 ? (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bank Name</th>
                                <th>Account Holder</th>
                                <th>Account Number</th>
                                <th>IFSC Code</th>
                                <th>UPI ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bankDetails.map((bank, index) => (
                                <tr key={index}>
                                    <td>{bank.id}</td>
                                    <td>{bank.bank_name}</td>
                                    <td>{bank.account_holder_name}</td>
                                    <td>{bank.account_number}</td>
                                    <td>{bank.ifsc_code}</td>
                                    <td>{bank.upi_id || "N/A"}</td>
                                    <td>
                                        <button onClick={() => changeBankStatus(bank.id, bank.status)}>
                                            {bank.status === "1" ? "Deactivate" : "Activate"}
                                        </button>
                                        &nbsp;
                                        <button onClick={() => deleteBank(bank.id)} style={{ color: "red" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No bank details available.</p>
                )}
            </div>
        );
    }
