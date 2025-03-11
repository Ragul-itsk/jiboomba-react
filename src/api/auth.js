import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/jiboomba"; 
export const register = async (data) => {
  // console.log(data)
  try {
    const response = await axios.post(`${API_URL}/register`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (data) => {

  try {
    const response = await axios.post(`${API_URL}/login`,data);
    // console.log(response.data)
    return response.data;
    
  } catch (error) {
    throw error.response.data;
  }
};



export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/player/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Print the response to the console
    // console.log("API Response:", response);

    // Return the response if needed
    return response;
  } catch (error) {
    // Handle any errors that might occur
    console.error("Error fetching profile:", error);
  }
};
