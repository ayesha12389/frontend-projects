import axios from 'axios';

// Set token from localStorage on app startup
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}