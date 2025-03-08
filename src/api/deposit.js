  import axios from "axios";

  const API_URL = "https://staging.syscorp.in/api/jiboomba"; 
  export const sendDepositRequest = async (data) => {
    // console.log(data)
    try {
      const response = await axios.post(`${API_URL}/send-deposit-request`,data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const getDepositMethod = async (token) => {
      try {
        const response = await axios.get(`${API_URL}/player/get-deposit-method`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
      //   console.log("Deposit Methods Response:", response.data); 
        return response.data;
      } catch (error) {
        console.error("Error fetching deposit methods:", error);
        return [];
      }
    };

    export const getPaymenttDetail = async (token) => {
      console.log("Token:", token); 
      // console.log("Payment Detail ID:", payment_detail_id); 
    
      try {
        const response = await axios.get(`${API_URL}/player/get-payment-detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching payment detail:", error);
        return [];
      }
    };
    


    

