import axios from "axios";
import { BASE_URL } from "../config/apiConfig";

export const sendWithdrawRequest = async (data, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/player/send-withdraw-request`,
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

export const getBank = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/player/get-bank`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("getBank Response:", response.data); // Debugging
  
      return response.data.playerBank || []; // Extract the playerBank array
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  };
  
  export const withdrawHistory = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/player/withdraw-history`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
    };




  


  

