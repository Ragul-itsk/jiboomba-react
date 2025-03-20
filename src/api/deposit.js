  import axios from "axios";

  const API_URL = "https://staging.syscorp.in/api/jiboomba"; 
  export const sendDepositRequest = async (data, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/player/send-deposit-request`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include Auth Token
            "Content-Type": "multipart/form-data", // If sending files
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  };
  
  export const getDepositMethod = async (token) => {
      try {
        const response = await axios.get(`${API_URL}/player/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
      //   console.log("Deposit Methods Response:", response.data); 
        return response.data;
      } catch (error) {
        console.error("Error fetching deposit methods:", error);
        return [];
      }
    };

    export const getPaymenttDetail = async (token, payment_method_id) => {
      try {
        const response = await axios.get(`${API_URL}/player/get-payment-detail?payment_method_id=${payment_method_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching payment details:", error);
        return { status: "error", paymentDetail: [] };
      }
    };

    export const depositHistory = async (token) => {
      try {
          const response = await axios.get(`${API_URL}/player/deposit-history`, {
          headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
      } catch (error) {
          console.error("Error fetching payment methods:", error);
          return [];
      }
      };
    


    

