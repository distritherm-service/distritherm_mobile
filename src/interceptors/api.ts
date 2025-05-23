import axios from "axios";

// Dans Expo, les variables d'environnement sont accessibles via process.env
// Elles doivent commencer par EXPO_PUBLIC_ pour être accessibles côté client
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-platform": "mobile"
  },
});

export default api;