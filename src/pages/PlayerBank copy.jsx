import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getBank } from "../api/withdraw"; // API function to add bank
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";

export default function PlayerBank() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Controlled input states
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!accountNumber || !ifscCode || !bankName || !accountHolderName) {
      setError("All fields are required.");
      return;
    }

    try {
      await getBank(token, {
        account_number: accountNumber,
        ifsc_code: ifscCode,
        bank_name: bankName,
        account_holder_name: accountHolderName,
      });
      console.log("inside redirect");
    } catch (error) {
      console.error("Error adding bank:", error);
      setError("Failed to add bank details.");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-center mb-4">Add New Bank</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Account Holder Name"
          />
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Bank Name"
          />
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Account Number"
          />
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="IFSC Code"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            Confirm
          </button>
        </form>
      </div>
    </Layout>
  );
}
