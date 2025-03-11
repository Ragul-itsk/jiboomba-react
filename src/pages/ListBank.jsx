import { useEffect, useState, useContext } from "react";
import { getBank } from "../api/player_bank";
import { AuthContext } from "../context/AuthContext";
import Layout from "./Layout";
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
            // <Layout>
            // <div>
            //     <h2>Bank Details</h2>
            //     {loading ? (
            //         <p>Loading...</p>
            //     ) : error ? (
            //         <p style={{ color: "red" }}>{error}</p>
            //     ) : bankDetails.length > 0 ? (
            //         <table border="1">
            //             <thead>
            //                 <tr>
            //                     <th>ID</th>
            //                     <th>Bank Name</th>
            //                     <th>Account Holder</th>
            //                     <th>Account Number</th>
            //                     <th>IFSC Code</th>
            //                     <th>UPI ID</th>
            //                     <th>Action</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //                 {bankDetails.map((bank, index) => (
            //                     <tr key={index}>
            //                         <td>{bank.id}</td>
            //                         <td>{bank.bank_name}</td>
            //                         <td>{bank.account_holder_name}</td>
            //                         <td>{bank.account_number}</td>
            //                         <td>{bank.ifsc_code}</td>
            //                         <td>{bank.upi_id || "N/A"}</td>
            //                         <td>
            //                             <button onClick={() => changeBankStatus(bank.id, bank.status)}>
            //                                 {bank.status === "1" ? "Deactivate" : "Activate"}
            //                             </button>
            //                             &nbsp;
            //                             <button onClick={() => deleteBank(bank.id)} style={{ color: "red" }}>
            //                                 Delete
            //                             </button>
            //                         </td>
            //                     </tr>
            //                 ))}
            //             </tbody>
            //         </table>
            //     ) : (
            //         <p>No bank details available.</p>
            //     )}
            // </div>
            // </Layout>
            <Layout>
  <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bank Details</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : bankDetails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Bank Name</th>
                <th className="px-4 py-2">Account Holder</th>
                <th className="px-4 py-2">Account Number</th>
                <th className="px-4 py-2">IFSC Code</th>
                <th className="px-4 py-2">UPI ID</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bankDetails.map((bank, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-center">{bank.id}</td>
                  <td className="px-4 py-2 text-center">{bank.bank_name}</td>
                  <td className="px-4 py-2 text-center">{bank.account_holder_name}</td>
                  <td className="px-4 py-2 text-center">{bank.account_number}</td>
                  <td className="px-4 py-2 text-center">{bank.ifsc_code}</td>
                  <td className="px-4 py-2 text-center">{bank.upi_id || "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => changeBankStatus(bank.id, bank.status)}
                      className={`px-3 py-1 text-white rounded-lg ${
                        bank.status === "1" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {bank.status === "1" ? "Deactivate" : "Activate"}
                    </button>
                    &nbsp;
                    <button
                      onClick={() => deleteBank(bank.id)}
                      className="ml-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}   
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No bank details available.</p>
      )}
    </div>
  </div>
</Layout>

        );
    }
