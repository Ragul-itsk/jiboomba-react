import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/jiboomba"; 
export const register = async (data) => {
  console.log(data)
  try {
    const response = await axios.post(`${API_URL}/register`,data);
    return response.data;
  } catch (error) {
    return error.response.data;
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

export const logout = async (token) => {

  // console.log(' logouttoken',token)
  try {
    const response = await axios.post(
      `${API_URL}/player/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Logout failed";
  }
};



export const verifyToken = async (token) => {
  try {
    console.log('inside verify try');

    const response = await axios.get(`${API_URL}/player/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    

    return response;
  } catch (error) {

    console.error("Error  verifying token:", error);
  }
};

export const authenticationType = async (data = {}) => {
  try {


    const response = await axios.get(`${API_URL}/authentication-type`, { params: data });

    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching login type:", error);
    throw error;
  }
};


export const loginOtpVerify = async (data) => {

  try {
    const response = await axios.post(`${API_URL}/login-otp-verify`,data);
    // console.log('rretrt',response.data) 
    return response.data;
    
  } catch (error) {
    throw error.response.data;
  }
};



export const  forgotPasswordOtpGenerate = async (data) => {

  try {
    const response = await axios.post(`${API_URL}/forgot-password-otp-generate`,data);
    // console.log('rretrt',response.data) 
    return response.data;
    
  } catch (error) {
    throw error.response.data;
  }
};

  export const  forgotPasswordOtpVerify = async (data) => {

    try {
      const response = await axios.post(`${API_URL}/forgot-password-otp-verify`,data);
      // console.log('rretrt',response.data) 
      return response.data;
      
    } catch (error) {
      throw error.response.data;
    }
  };



  export const  newPasswordCreate = async (data) => {

    try {
      const response = await axios.post(`${API_URL}/new-password-create`,data);
      // console.log('rretrt',response.data) 
      return response.data;
      
    } catch (error) {
      throw error.response.data;
    }
  };








