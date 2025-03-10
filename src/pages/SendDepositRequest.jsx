import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendDepositRequest, getPaymenttDetail } from "../api/deposit";
import { AuthContext } from "../context/AuthContext";

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
    <div>
      <h2>Send Deposit Request</h2>
      <form onSubmit={handleSubmit}>
        {/* Deposit Method Dropdown */}
        <select onChange={handleDepositMethodChange} required>
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

        {/* Hidden Input for Payment Detail ID */}
        <input type="hidden" name="payment_detail_id" value={formData.payment_detail_id} />

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
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
