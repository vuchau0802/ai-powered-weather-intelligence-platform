import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const fetchWeather = (city: string) => {
  return API.get(`/weather?city=${encodeURIComponent(city)}`);
};

export const fetchHistory = () => {
  return API.get("/weather/history");
};

export const deleteRecord = (id: number) => {
  return API.delete(`/weather/${id}`);
};

export const updateRecord = (id: number, data: Partial<{
  city: string;
  temperature: number;
  humidity: number;
  description: string;
}>) => {
  return API.put(`/weather/${id}`, data);
};

export const exportCSV = () => {
  window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/weather/export/csv`);
};

export const exportJSON = () => {
  window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/weather/export/json`);
};