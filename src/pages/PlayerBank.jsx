import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBank } from "../api/withdraw";
import { storeBank } from "../api/player_bank";
import Layout from "./Layout";
import { FaHistory } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";

export default function SendWithdrawRequestForm() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!accountNumber || !ifscCode || !bankName || !accountHolderName) {
      setError("All fields are required.");
      return;
    }

    try {
      await storeBank(
        {
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_name: bankName,
          account_holder_name: accountHolderName,
        },
        token
      );

      // Redirect back to Withdraw page after adding
      console.log("Bank details stored successfully. Navigating back...");
      navigate(-1);
    } catch (error) {
      console.error("Error adding bank:", error);
      setError("Failed to add bank details.");
    }
  };

  return (
    <Layout>
      <div className="p-0">
        <div className="absolute inset-0 bg-black opacity-50 rounded-t-lg"></div>

        <div className="relative ">
          <div className="flex items-center justify-between mb-4 relative ">
            <button onClick={() => navigate(-1)} className="text-white">
              <IoMdArrowRoundBack size={18} />
            </button>
            <h2 className="text-lg text-white font-semibold">Withdraw</h2>
            <button onClick={() => navigate(-1)} className="text-white">
              <FaHistory />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <div className="fixed bottom-10 inset-x-0 bg-cover bg-center p-0 rounded-t-lg">
              <motion.div
                className="absolute inset-0 opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsOpen(false)}
              ></motion.div>

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="relative bg-white rounded-t-lg p-6 shadow-lg"
              >
                <label className="block text-lg font-semibold text-center mb-4 text-gray-700">
                  Add payment details
                </label>
                <form onSubmit={handleSubmit}>
                  <input
                    type="number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                    placeholder="Account Number"
                  />
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                    placeholder="IFSC CODE"
                  />
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                    placeholder="Bank Name"
                  />
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                    placeholder="Account holder name"
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg mt-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    Confirm
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
