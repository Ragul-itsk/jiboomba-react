import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeBank, getPaymentMethod } from "../api/player_bank";
import { AuthContext } from "../context/AuthContext";

export default function StoreBankForm() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    payment_method_id: "",
    upi_id: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    account_holder_name: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!token) return;
      try {
        const response = await getPaymentMethod(token);
        if (response && response.paymentMethod) {
          setPaymentMethods(response.paymentMethod);
        } else {
          setPaymentMethods([]);
        }
      } catch (err) {
        console.error("Error fetching payment methods:", err);
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await storeBank(formData, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Deposit Request failed!");
    }
  };

  return (
    <div>
      <h2>Store Bank</h2>
      <form onSubmit={handleSubmit}>
        {/* Payment Method Dropdown */}
        <select
          value={formData.payment_method_id}
          onChange={(e) =>
            setFormData({ ...formData, payment_method_id: e.target.value })
          }
          required
        >
          <option value="">Select Payment Method</option>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))
          ) : (
            <option disabled>No Payment Methods Available</option>
          )}
        </select>

        <input
  type="hidden"
  name="payment_method_id"
  value={formData.payment_method_id}
/>

        {/* Show Bank Details if payment_detail_id is 1 */}
        {formData.payment_method_id === "1" && (
          <>
            <input
              type="text"
              placeholder="Account Number"
              value={formData.account_number}
              onChange={(e) =>
                setFormData({ ...formData, account_number: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={formData.ifsc_code}
              onChange={(e) =>
                setFormData({ ...formData, ifsc_code: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Bank Name"
              value={formData.bank_name}
              onChange={(e) =>
                setFormData({ ...formData, bank_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Account Holder Name"
              value={formData.account_holder_name}
              onChange={(e) =>
                setFormData({ ...formData, account_holder_name: e.target.value })
              }
              required
            />
          </>
        )}

        {/* Show UPI ID if payment_detail_id is 2 */}
        {formData.payment_method_id === "2" && (
          <input
            type="text"
            placeholder="UPI ID"
            value={formData.upi_id}
            onChange={(e) =>
              setFormData({ ...formData, upi_id: e.target.value })
            }
            required
          />
        )}

        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
