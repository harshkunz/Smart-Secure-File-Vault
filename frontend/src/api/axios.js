import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if your backend uses cookies or sessions
});

// You can add interceptors here if you want to attach tokens or handle errors globally
export default instance;
