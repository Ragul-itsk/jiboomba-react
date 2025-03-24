import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendDepositRequest, getPaymenttDetail } from "../api/deposit";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./Layout";
import { FaRegCopy } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Optional: Show alert or toast
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");

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

  // Handle tab selection
  const handleDepositMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentDetails([]);
    setError("");
  };

  const activeDetail = 1;

  // Handle form submission
  const handleUTR = () => {
    if (!activeDetail) {
      alert("No payment details available for this method!");
      return;
    }

    navigate(
      `/deposit-request?amount=${amount}&detailId=${activeDetail.id}&activeType=${selectedMethod}`
    );
  };

  return (
    <Layout>
      <div className="p-0 ">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 rounded-t-lg"></div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-4 text-white">
          <button onClick={() => navigate(-1)} className="text-white">
            <IoMdArrowRoundBack size={18} />
          </button>
          <h2 className="text-lg text-white font-semibold">Deposit</h2>
          <button
            onClick={() => navigate("/deposit-history")}
            className="text-white"
          >
            <FaHistory />
          </button>
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
                <h3 className="text-lg font-semibold text-center text-gray-700">
                  Make Payment for {amount}
                </h3>

                {/* Tabs */}
                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                  <ul className="flex flex-wrap -mb-px">
                    {depositMethods.length > 0 ? (
                      depositMethods.map((method) => (
                        <li key={method.id} className="me-2">
                          <button
                            onClick={() => handleDepositMethodChange(method.id)}
                            className={`flex items-center gap-2 p-4 border-b-2 rounded-t-lg ${
                              selectedMethod === method.id
                                ? "text-blue-600 border-blue-600"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {/* Icon Placeholder (Can replace with actual icons) */}
                            <span>💳</span> {method.name}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>
                        <button
                          disabled
                          className="p-4 text-gray-400 cursor-not-allowed"
                        >
                          No Methods Available
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tab Content */}
                <motion.div className="mt-4 p-4 border rounded-lg bg-gray-50 h-[270px] overflow-auto">
                  {selectedMethod ? (
                    <>

                      {/* Loading State */}
                      {isLoading ? (
                        <p className="text-blue-500">Loading...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <ul className="mt-1">
                          {paymentDetails.length > 0 ? (
                            paymentDetails.map((detail, index) => (
                              <li
                                key={index}
                                className="text-gray-700 p-1 border-b"
                              >
                                {/* Ensure that values exist before rendering */}
                                {detail.account_number && (
                                  <div className="items-center justify-between p-0 rounded-lg">
                                    <label className="font-small text-gray-700">
                                      Account Number
                                    </label>
                                    <div className="flex justify-between items-center bg-gray-200 p-0 pr-0 gap-2 w-full">
                                      <span className="text-gray-900 py-2 pl-2">
                                        {detail.account_number}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleCopy(detail.account_number)
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-2 bg-gray-300"
                                      >
                                        <FaRegCopy size={20} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {detail.ifsc_code && (
                                  <div className="items-center justify-between p-0 rounded-lg">
                                    <label className="font-small text-gray-700">
                                      IFSC Code
                                    </label>
                                    <div className="flex justify-between items-center bg-gray-200 p-0 pr-0 gap-2 w-full">
                                      <span className="text-gray-900 py-2 pl-2">
                                        {detail.ifsc_code}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleCopy(detail.ifsc_code)
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-2 bg-gray-300"
                                      >
                                        <FaRegCopy size={20} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {detail.bank_name && (
                                  <div className="items-center justify-between p-0 rounded-lg">
                                    <label className="font-small text-gray-700">
                                      Bank Name
                                    </label>
                                    <div className="flex justify-between items-center bg-gray-200 p-0 pr-0 gap-2 w-full">
                                      <span className="text-gray-900 py-2 pl-2">
                                        {detail.bank_name}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleCopy(detail.bank_name)
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-2 bg-gray-300"
                                      >
                                        <FaRegCopy size={20} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {detail.account_holder_name && (
                                  <div className="items-center justify-between p-0 rounded-lg">
                                    <label className="font-small text-gray-700">
                                      Account Holder Name
                                    </label>
                                    <div className="flex justify-between items-center bg-gray-200 p-0 pr-0 gap-2 w-full">
                                      <span className="text-gray-900 py-2 pl-2">
                                        {detail.account_holder_name}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleCopy(detail.account_holder_name)
                                        }
                                        className="text-blue-500 hover:text-blue-700 p-2 bg-gray-300"
                                      >
                                        <FaRegCopy size={20} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {detail.upi_id && (
                                  <p>
                                    <strong>UPI ID:</strong> {detail.upi_id}
                                  </p>
                                )}
                                {detail.qr_code && (
                                  <div>
                                    <strong>QR Code:</strong>
                                    <img
                                      src={detail.qr_code}
                                      alt="QR Code"
                                      className="mt-2 w-32 h-32"
                                    />
                                  </div>
                                )}
                              </li>
                            ))
                          ) : (
                            <p className="text-gray-500">
                              No additional details available.
                            </p>
                          )}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Please select a payment method.
                    </p>
                  )}
                </motion.div>

                {/* Confirm Button */}
                <button
                  className={`w-full py-2 rounded-lg mt-2 ${
                    selectedMethod
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleUTR}
                  disabled={!selectedMethod}
                >
                  Enter UTR
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
