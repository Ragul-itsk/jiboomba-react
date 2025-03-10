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

  return axios.get(`${API_URL}/player/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  
};
