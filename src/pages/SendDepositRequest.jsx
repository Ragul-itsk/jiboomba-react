import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendDepositRequest, getPaymenttDetail } from "../api/deposit";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./Layout";
import { FaRegCopy } from "react-icons/fa6";

export default function SendDepositRequestForm() {
  const { token, depositMethods } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    payment_detail_id: "",
    amount: "",
    utr: "",
    image: null,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const amount = queryParams.get("amount");
  const detailId = queryParams.get("detailId");
  const activeType = queryParams.get("activeType");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Optional: Show alert or toast
  };

  // Set default selected method on page load
  useEffect(() => {
    if (depositMethods.length > 0 && !selectedMethod) {
      setSelectedMethod(depositMethods[0].id);
    }
  }, [depositMethods, selectedMethod]);

  // Fetch payment details when a deposit method is selected
  useEffect(() => {
    if (selectedMethod) {
      setIsLoading(true);
      setPaymentDetails([]);
      getPaymenttDetail(token, selectedMethod)
        .then((res) => {
          if (res.status === "success") {
            setPaymentDetails(res.paymentDetail);
            if (res.paymentDetail.length > 0) {
              setFormData((prevData) => ({
                ...prevData,
                payment_detail_id: res.paymentDetail[0].id,
              }));
            }
          } else {
            setError("No payment details available.");
          }
        })
        .catch(() => setError("Failed to fetch payment details."))
        .finally(() => setIsLoading(false));
    }
  }, [selectedMethod, token]);

  //new 
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: amount || "", // Set amount from query param

    }));
  }, [amount]);
  

  // Handle tab selection
  const handleDepositMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentDetails([]);
    setError("");
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log(formData);
  //     await sendDepositRequest(formData, token);
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError(err?.message || "Deposit Request failed!");
  //   }
  // };

// new 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Ensure amount and image are provided
    if (!formData.amount) {
      setError("Amount is required.");
      return;
    }
    if (!formData.image) {
      setError("Image is required.");
      return;
    }
  
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("payment_detail_id", formData.payment_detail_id);
      formDataPayload.append("amount", formData.amount);
      formDataPayload.append("utr", formData.utr);
      if (formData.image) {
        formDataPayload.append("image", formData.image);
      }
  
      await sendDepositRequest(formDataPayload, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Deposit Request failed!");
    }
  };
  

  return (
    <Layout>
      <div className="p-0 ">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 rounded-t-lg"></div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-4 text-white">
          <button onClick={() => navigate(-1)}>&#8592; Back</button>
          <h2 className="text-lg font-semibold">Deposit</h2>
          <button onClick={() => navigate(-1)}>Close</button>
        </div>

        {/* Modal Animation */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed bottom-10 inset-x-0 bg-cover bg-center rounded-t-lg">
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
                <div className="text-center mb-5">
                  <span className="text-lg text-center bg-gray-400 p-4 rounded-lg text-white">
                    {amount}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
                  Enter UTR to Confirm Deposit
                </h3>
                <form onSubmit={handleSubmit}>
                  {/* Hidden Input for Payment Detail ID */}
                  <input
                    type="hidden"
                    name="payment_detail_id"
                    value={detailId}
                  />

                  <input
                    type="hidden"
                    placeholder="Amount"
                    name="amount"
                    value={amount}
                  />
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
                    placeholder="UTR"
                    onChange={(e) =>
                      setFormData({ ...formData, utr: e.target.value })
                    }
                    required
                  />
                  <input
                    type="file"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg mt-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    Submit
                  </button>
                  {error && <p>{error}</p>}
                </form>

                {/* Confirm Button */}
                {/* <button
                  className={`w-full py-2 rounded-lg mt-2 ${
                    selectedMethod
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                  disabled={!selectedMethod}
                >
                  Submit
                </button> */}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
