import axios from 'axios';

const axiosInstance = axios.create({
 baseURL:'http://localhost:8000/api/data-entry', // Backend URL
  withCredentials: true, // Cookies ko bhejne ke liye
});

export default axiosInstance;
