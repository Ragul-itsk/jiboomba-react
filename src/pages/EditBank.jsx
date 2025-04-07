import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config/apiConfig";

const EditBank = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bank, setBank] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
  });

  useEffect(() => {
    const fetchBankDetails = async () => {
      if (!id || !token) return; // Prevent unnecessary API calls

      try {
        const response = await axios.get(`${BASE_URL}/player/edit-bank/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        if (response.data && response.data.playerBank) {
          setBank({
            bank_name: response.data.playerBank.bank_name || "",
            account_holder_name:
              response.data.playerBank.account_holder_name || "",
            account_number: response.data.playerBank.account_number || "",
            ifsc_code: response.data.playerBank.ifsc_code || "",
            upi_id: response.data.playerBank.upi_id || "",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching bank details:",
          error.response?.data || error.message
        );
      }
    };

    fetchBankDetails();
  }, [id, token]);

  const handleChange = (e) => {
    setBank((prevBank) => ({
      ...prevBank,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/player/update-bank/${id}`, bank, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Bank details updated successfully!");
      navigate("/list-bank");
    } catch (error) {
      console.error(
        "Error updating bank details:",
        error.response?.data || error.message
      );
      alert("Failed to update bank details. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Bank Details</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Bank Name", name: "bank_name" },
          { label: "Account Holder Name", name: "account_holder_name" },
          { label: "Account Number", name: "account_number" },
          { label: "IFSC Code", name: "ifsc_code" },
          { label: "UPI ID (Optional)", name: "upi_id" },
        ].map(({ label, name }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-700">{label}</label>
            <input
              type="text"
              name={name}
              value={bank[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={name !== "upi_id"}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Update Bank
        </button>
      </form>
    </div>
  );
};

export default EditBank;
