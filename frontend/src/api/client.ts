import axios from 'axios';

// Use environment variable or default to /be/api for Dokploy setup
// For local development with docker-compose, override with VITE_API_BASE_URL=/api
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/be/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
