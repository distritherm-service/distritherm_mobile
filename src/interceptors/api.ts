import axios from "axios";
import Config from "react-native-config";

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;