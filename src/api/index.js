// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => api.post("/auth/login", credentials);
export const getCurrentUser = () => api.get("/auth/me");

// Drivers API
export const getDrivers = () => api.get("/drivers");
export const getDriver = (id) => api.get(`/drivers/${id}`);
export const createDriver = (data) => api.post("/drivers", data);
export const updateDriver = (id, data) => api.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

// Routes API
export const getRoutes = () => api.get("/routes");
export const getRoute = (id) => api.get(`/routes/${id}`);
export const createRoute = (data) => api.post("/routes", data);
export const updateRoute = (id, data) => api.put(`/routes/${id}`, data);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

// Orders API
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post("/orders", data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Simulation API
export const runSimulation = (params) => api.post("/simulate", params);
export const getSimulations = () => api.get("/simulate");
export const getLatestSimulation = () => api.get("/simulate/latest");

export default api;
