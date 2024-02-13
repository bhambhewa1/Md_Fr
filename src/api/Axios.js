import axios from "axios";
import { BASE_URL } from "./API";
import Cookies from "js-cookie";

// Create a base Axios instance with common settings
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosFileInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  },
});

// Intercept requests to update headers when token changes on frontend send to backend
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${Cookies.get("userToken")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an Axios interceptor after response from backend to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or unauthorized, handle logout here
//       Cookies.remove("userToken");
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// Axios Instances
const axiosGet = axiosInstance;
const axiosPut = axiosInstance;
const axiosPost = axiosInstance;
const axiosDelete = axiosInstance;
const axiosFilePost = axiosFileInstance;

// API functions using the Axios instances
const Axios = {
  get: (endpoint) => axiosGet.get(endpoint),
  put: (endpoint, data) => axiosPut.put(endpoint, data),
  post: (endpoint, data) => axiosPost.post(endpoint, data),
  Filepost: (endpoint, data) => axiosFilePost.post(endpoint, data),
  delete: (endpoint) => axiosDelete.delete(endpoint),
};

export default Axios;
