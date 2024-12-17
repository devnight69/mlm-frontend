import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://192.168.29.179:5000/api/",
  baseURL: "http://localhost:5000/api/",
  // baseURL: "https://mlm-backend-mern.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
