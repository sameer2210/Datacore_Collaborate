// import axios from 'axios';

// const axiosInstance = axios.create({
//  baseURL:'http://localhost:8000/api/data-entry', // Backend URL
//   // Cookies ko bhejne ke liye
// });

// export default axiosInstance;



import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/data-entry', // Backend URL
  withCredentials: true, // Cookies for auth
});

export default axiosInstance;