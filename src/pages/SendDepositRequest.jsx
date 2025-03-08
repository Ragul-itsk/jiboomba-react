import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { sendDepositRequest, getPaymenttDetail } from "../api/deposit"; 
import { AuthContext } from "../context/AuthContext";

export default function SendDepositRequestForm() {  
  const { depositMethods, token } = useContext(AuthContext); 
  const [paymentDetails, setPaymentDetails] = useState([]); 
  const [formData, setFormData] = useState({ payment_detail_id: "", amount: "", utr: "", image: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendDepositRequest(formData);
      navigate("/");
    } catch (err) {
      setError("Deposit Request failed!");
    }
  };

  return (
    <div>
      <h2>Send Deposit Request</h2>
      <form onSubmit={handleSubmit}>
      <select
  onChange={(e) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, payment_detail_id: selectedId });

    // Fetch payment details for the selected payment method
    getPaymenttDetail(token, selectedId)  // ✅ Pass selectedId
      .then((res) => {
        if (res.status === "success") {
          setPaymentDetails(res.paymentMethod); // ✅ Store details
        } else {
          setPaymentDetails([]);
        }
      })
      .catch(() => setPaymentDetails([]));
  }}
  required
>
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


        <input type="text" placeholder="Amount" onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
        <input type="text" placeholder="Utr" onChange={(e) => setFormData({ ...formData, utr: e.target.value })} required />
        <input type="file" placeholder="Image" onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
