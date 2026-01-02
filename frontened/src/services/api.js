import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend API prefix
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMenu = async () => {
  const res = await fetch("http://localhost:3000/api/menu/");
  return res.json();
};


export default api;
