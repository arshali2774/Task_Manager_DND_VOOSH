import axios from 'axios';

// created custom axios instance with baseURL, headers, and withCredentials
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
