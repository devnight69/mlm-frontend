import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://mlm-backend-mern.vercel.app/",
});

export default axiosInstance;
