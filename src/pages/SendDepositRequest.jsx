import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendDepositRequest, getPaymenttDetail } from "../api/deposit";
import { AuthContext } from "../context/AuthContext";
import Layout from "./Layout";

export default function SendDepositRequestForm() {
  const { token, depositMethods } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [formData, setFormData] = useState({ payment_detail_id: "", amount: "", utr: "", image: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch payment details when a deposit method is selected
  useEffect(() => {
    if (selectedMethod) {
      getPaymenttDetail(token, selectedMethod)
        .then((res) => {
          if (res.status === "success") {
            setPaymentDetails(res.paymentDetail);
            if (res.paymentDetail.length > 0) {
              setFormData((prevData) => ({
                ...prevData,
                payment_detail_id: res.paymentDetail[0].id, // Set the first payment detail ID
              }));
            }
          } else {
            setPaymentDetails([]);
          }
        })
        .catch(() => setPaymentDetails([]));
    }
  }, [selectedMethod, token]);

  // Handle dropdown change
  const handleDepositMethodChange = (e) => {
    setSelectedMethod(e.target.value);
    setPaymentDetails([]); // Clear old data
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendDepositRequest(formData, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Deposit Request failed!");
    }         
  };

  return (
    <Layout>
    <div className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-5">Deposit</h2>
    <form class="max-w-lg w-full mx-auto" onSubmit={handleSubmit}>
  <div class="mb-5">
  <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Payment Method</label>
  <select id="payment_method_id" onChange={handleDepositMethodChange} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

    <option value="">Select Payment Method</option>
    {depositMethods.length > 0 ? (
            depositMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}  
  </select>
   {/* Show Payment Details */}
   {paymentDetails.length > 0 && (
          <div>
            <h3>Payment Details:</h3>
            <ul>
              {paymentDetails.map((detail) => (
                <li key={detail.id}>
                  <strong>Payment Method:</strong> {detail.payment_method?.name} <br />
                  {detail.payment_method?.name === "Bank" ? (
                    <>
                      <strong>Account Holder:</strong> {detail.account_holder_name} <br />
                      <strong>Account Number:</strong> {detail.account_number} <br />
                      <strong>Bank Name:</strong> {detail.bank_name} <br />
                      <strong>IFSC Code:</strong> {detail.ifsc_code} <br />
                    </>
                  ) : (
                    <>
                      <strong>UPI ID:</strong> {detail.upi_id || "N/A"} <br />
                      <strong>QR Code:</strong> <br />
                      {detail.qr_code && <img src={`https://staging.syscorp.in/storage/${detail.qr_code}`} alt="QR Code" width="100" />}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
  </div>
  {/* <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div class="flex items-start mb-5">
    <div class="flex items-center h-5">
      <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
    </div>
    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
  </div>
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form> */}
<input type="hidden" name="payment_detail_id" value={formData.payment_detail_id} />
 <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
    <input type="text" id="amount"  onChange={(e) => setFormData({ ...formData, amount: e.target.value })} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UTR</label>
    <input type="text" id="utr"  onChange={(e) => setFormData({ ...formData, utr: e.target.value })} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
    <input type="file" id="image"  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
    <div class="flex justify-center mt-4">
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    Submit
  </button>
</div>


{error && <p>{error}</p>}
</form>
      
    </div>
    </Layout>
  );
}
