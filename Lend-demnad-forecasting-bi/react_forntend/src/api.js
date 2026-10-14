import axios from "axios";

const API_BASE = "http://localhost:5000";
export const getSalesForecast = async () => {
  try {
    const response = await axios.get(`${API_BASE}/forecast`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};