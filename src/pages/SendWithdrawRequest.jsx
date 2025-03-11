import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendWithdrawRequest, getBank } from "../api/withdraw"; 
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";

export default function SendWithdrawRequestForm() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ player_bank_id: "", amount: "", utr: "", image: "" });
  const [error, setError] = useState("");
  const [banks, setBanks] = useState([]); // Store bank data
  const navigate = useNavigate();

  // Fetch banks on component mount
  useEffect(() => {
    if (!token) return; // Ensure token exists
  
    const fetchBanks = async () => {
      try {
        const bankList = await getBank(token);
        console.log("Bank List:", bankList); // Debugging
        setBanks(bankList); // Already an array
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
  
    fetchBanks();
  }, [token]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendWithdrawRequest(formData, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Withdraw Request failed!");
    }
  };

  return (
//     <Layout>
//     <div>
//       <h2>Send Withdraw Request</h2>
//       <form onSubmit={handleSubmit}>

//         {/* Bank Selection */}
// {/* Bank Selection */}
// <div>
//   <h4>Select a Bank</h4>
//   {banks.length > 0 ? (
//     banks.map((bank) => (
//       <div key={bank.id} style={styles.card}>
//         <input
//           type="radio"
//           name="player_bank_id"
//           value={bank.id}
//           onChange={(e) => setFormData({ ...formData, player_bank_id: e.target.value })}
//           required
//         />
//         <div>
//           <strong>Payment Method:</strong> {bank.payment_method?.name || "N/A"}
//           <br />
//           <strong>UPI ID:</strong> {bank.upi_id || "N/A"}
//           <br />
//           <strong>Account Number:</strong> {bank.account_number || "N/A"}
//           <br />
//           <strong>IFSC Code:</strong> {bank.ifsc_code || "N/A"}
//           <br />
//           <strong>Bank Name:</strong> {bank.bank_name || "N/A"}
//           <br />
//           <strong>Account Holder:</strong> {bank.account_holder_name || "N/A"}
//           <br />
//           <strong>Status:</strong> {bank.status === "0" ? "Inactive" : "Active"}
//         </div>
//       </div>
//     ))
//   ) : (
//     <p>No banks available</p>
//   )}
// </div>


// <input type="hidden" name="player_bank_id" value={formData.player_bank_id} />
//         <input
//           type="text"
//           placeholder="Amount"
//           onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="UTR"
//           onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
//           required
//         />
//         <input
//           type="file"
//           onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
//           required
//         />

//         <button type="submit">Submit</button>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </form>
//     </div>
//     </Layout>
<Layout>
  <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Send Withdraw Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Selection */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Select a Bank</h4>
          {banks.length > 0 ? (
            banks.map((bank) => (
              <label
                key={bank.id}
                className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="radio"
                  name="player_bank_id"
                  value={bank.id}
                  onChange={(e) =>
                    setFormData({ ...formData, player_bank_id: e.target.value })
                  }
                  required
                  className="w-5 h-5 accent-blue-500"
                />
                <div className="text-sm text-gray-700">
                  <strong>Payment Method:</strong> {bank.payment_method?.name || "N/A"}
                  <br />
                  <strong>UPI ID:</strong> {bank.upi_id || "N/A"}
                  <br />
                  <strong>Account Number:</strong> {bank.account_number || "N/A"}
                  <br />
                  <strong>IFSC Code:</strong> {bank.ifsc_code || "N/A"}
                  <br />
                  <strong>Bank Name:</strong> {bank.bank_name || "N/A"}
                  <br />
                  <strong>Account Holder:</strong> {bank.account_holder_name || "N/A"}
                  <br />
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      bank.status === "0" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {bank.status === "0" ? "Inactive" : "Active"}
                  </span>
                </div>
              </label>
            ))
          ) : (
            <p className="text-red-600 text-sm">No banks available</p>
          )}
        </div>

        <input type="hidden" name="player_bank_id" value={formData.player_bank_id} />

        {/* Amount Input */}
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* UTR Input */}
        <input
          type="text"
          placeholder="UTR"
          onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          required
          className="w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-blue-600 hover:file:bg-blue-700"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {/* Error Message */}
        {error && <p className="text-center text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  </div>
</Layout>

  );
}

// Simple card styling
const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};
