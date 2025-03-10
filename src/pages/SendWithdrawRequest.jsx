import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendWithdrawRequest, getBank } from "../api/withdraw"; 
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
    <div>
      <h2>Send Withdraw Request</h2>
      <form onSubmit={handleSubmit}>

        {/* Bank Selection */}
{/* Bank Selection */}
<div>
  <h4>Select a Bank</h4>
  {banks.length > 0 ? (
    banks.map((bank) => (
      <div key={bank.id} style={styles.card}>
        <input
          type="radio"
          name="player_bank_id"
          value={bank.id}
          onChange={(e) => setFormData({ ...formData, player_bank_id: e.target.value })}
          required
        />
        <div>
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
          <strong>Status:</strong> {bank.status === "0" ? "Inactive" : "Active"}
        </div>
      </div>
    ))
  ) : (
    <p>No banks available</p>
  )}
</div>


<input type="hidden" name="player_bank_id" value={formData.player_bank_id} />
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="UTR"
          onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          required
        />

        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
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
