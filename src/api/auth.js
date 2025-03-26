import axios from "axios";

const API_URL = "https://staging.syscorp.in/api/v1/starbuks"; 

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
    

    // console.log("API Response:", response);

    return response;
  } catch (error) {
  
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


  export const authenticationOtpVerify = async (data) => {

    try {
      const response = await axios.post(`${API_URL}/authentication-otp-verify`,data);
      console.log('rretrt',response.data) 
      return response.data;
      
    } catch (error) {
      throw error.response.data;
    }
  };

  export const resendOtp = async (data) => {

    try {
      const response = await axios.post(`${API_URL}/resend-otp`,data);
      console.log('resend',response.data) 
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
      console.log('rretrt',response.data) 
      return response.data;
      
    } catch (error) {
      throw error.response.data;
    }
  };








