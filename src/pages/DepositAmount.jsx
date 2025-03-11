import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./Layout";

export default function DepositPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const suggestedAmounts = [50, 100, 200, 500];

  const validateAndSubmit = () => {
    if (!amount) {
      setError("Amount is required");
      return;
    }
    if (amount < 100) {
      setError("Minimum amount is 100");
      return;
    }
    if (amount > 10000) {
      setError("Maximum amount is 10,000");
      return;
    }

    setError(""); // Clear errors
    navigate(`/deposit-request?amount=${amount}`); // Navigate with amount
  };

  
  return (
    <Layout>
      <div className="p-0">
      <div className="absolute inset-0 bg-black opacity-50 rounded-t-lg"></div>

        <div className="relative ">
          <div className="flex items-center justify-between mb-4 relative ">
            <button onClick={() => navigate(-1)} className="text-white">
              &#8592; Back
            </button>
            <h2 className="text-lg text-white font-semibold">Deposit</h2>
            <button onClick={() => navigate(-1)} className="text-white">
              Close
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

              {/* Modal Content */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="relative bg-white rounded-t-lg p-6 shadow-lg"
              >
                <label className="block text-lg font-semibold text-center mb-4 text-gray-700">Enter Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  max="10000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                  placeholder="Enter amount"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className="flex justify-around mb-4">
                  {suggestedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-lg mt-2 hover:bg-green-600"
                 onClick={validateAndSubmit}
                >
                  Confirm
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
