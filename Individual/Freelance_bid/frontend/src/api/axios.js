// import axios from 'axios';

// const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  // Dynamically uses your deployed production domain, or falls back to localhost during local running
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      console.warn("Unauthorized request detected — token may be missing or expired.");
    } else if (status === 500) {
      console.error("Internal server error encountered.");
    }
    return Promise.reject(error);
  }
);

export default api;
