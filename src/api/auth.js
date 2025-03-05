import axios from "axios";

const API_URL = "http://your-laravel-api.test/api"; // Change this

export const register = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const getProfile = async (token) => {
  return axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
