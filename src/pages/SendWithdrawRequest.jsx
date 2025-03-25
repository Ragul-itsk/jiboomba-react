import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { motion, AnimatePresence } from "framer-motion";
import { sendWithdrawRequest, getBank } from "../api/withdraw";
import Layout from "./Layout";
import { FaHistory } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import { FaPlus, FaArrowRightLong } from "react-icons/fa6";

export default function SendWithdrawRequestForm() {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get query params
  const queryParams = new URLSearchParams(location.search);
  const initialAmount = queryParams.get("amount") || ""; // Get amount from URL

  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    getBank(token)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPaymentDetails(res);
          setSelectedOption(res[0].id); // Auto-select first bank
        } else {
          setError("No bank details available.");
        }
      })
      .catch((error) => {
        console.error("API Fetch Error:", error);
        setError("Failed to fetch payment details.");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount) {
      setError("Amount is required.");
      return;
    }
    if (!selectedOption) {
      setError("Please select a bank.");
      return;
    }

    const formData = new FormData();
    formData.append("player_bank_id", selectedOption);
    formData.append("amount", amount);
    try {
      await sendWithdrawRequest(formData, token);
      navigate("/withdraw-history"); // Redirect on success
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      setError(error?.message || "Failed to send withdraw request.");
    }
  };

  return (
    <Layout>
      <div className="p-0">
        <div className="absolute inset-0 bg-black opacity-50 rounded-t-lg"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4 relative">
            <button onClick={() => navigate(-1)} className="text-white">
              <IoMdArrowRoundBack size={18} />
            </button>
            <h2 className="text-lg text-white font-semibold">Withdraw</h2>
            <button onClick={() => navigate('/withdraw-history')} className="text-white">
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
                  Select Withdraw Bank ({amount})
                </label>
                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="amount" value={amount} />
                  <div className="max-h-[220px] overflow-y-scroll mb-4">
                    <ul className="grid w-full gap-6 md:grid-cols-2">
                      {paymentDetails.map((bank) => (
                        <li key={bank.id} className="relative">
                          <input
                            type="radio"
                            id={`bank-${bank.id}`}
                            name="bank"
                            value={bank.id.toString()} // Ensure value is a string
                            className="absolute opacity-0 w-0 h-0 peer"
                            required
                            onChange={(e) => setSelectedOption(e.target.value)}
                            checked={selectedOption === bank.id.toString()}
                          />
                          <label
                            htmlFor={`bank-${bank.id}`}
                            className="flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-400"
                          >
                            <div>
                              <div className="font-semibold">
                                {bank.account_holder_name}, {bank.bank_name}
                              </div>
                              <div className="text-sm">
                                {bank.account_number} | {bank.ifsc_code}
                              </div>
                            </div>
                            <FaArrowRightLong
                              size={20}
                              className="text-gray-500"
                            />
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  <div className="flex">
                    <button
                      type="submit"
                      className="w-3/4 mx-1 py-2 rounded-md mt-2 bg-green-500 text-white hover:bg-green-600"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/player-bank")}
                      className="w-1/5 mx-1 py-2 rounded-md mt-2 bg-white-500 text-gray-500 hover:bg-blue-600 border"
                    >
                      <FaPlus className="m-auto" size={18} />
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
