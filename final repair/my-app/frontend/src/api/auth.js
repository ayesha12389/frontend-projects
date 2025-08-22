import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Backend URL

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed. Try again!" };
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    // ✅ Store token immediately after login
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed. Check your credentials!" };
  }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token"); // ✅ Get stored token
  
  if (!token) {
    throw { message: "Unauthorized! Please log in." };
  }

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile!" };
  }
};
