import axios from 'axios';

// created custom axios instance with baseURL, headers, and withCredentials
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  credentials: 'include',
});

export default axiosInstance;
