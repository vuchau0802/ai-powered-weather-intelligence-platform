"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import {
  fetchWeather,
  fetchHistory,
  deleteRecord,
  exportCSV,
  exportJSON,
} from "../services/api";

import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import AirQuality from "../components/AirQuality";
import Insight from "../components/Insight";
import YouTube from "../components/YouTube";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const WeatherChart = dynamic(() => import("../components/WeatherChart"), { ssr: false });

interface HistoryRecord {
  id: number;
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  createdAt: string;
}

interface ErrorState {
  title: string;
  message: string;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError({
        title: "City required",
        message: "Please enter a city name before searching.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetchWeather(city.trim());
      setData(res.data);
    } catch (err: any) {
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.error;

      if (status === 404) {
        setError({
          title: "City not found",
          message: apiMessage || "We could not find that location. Check the spelling and try again.",
        });
      } else {
        setError({
          title: "Weather request failed",
          message: apiMessage || "The weather service did not respond. Please try again in a moment.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleShowHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchHistory();
      setHistory(res.data);
      setShowHistory(true);
    } catch {
      setError({
        title: "History unavailable",
        message: "Failed to load search history. Please try again.",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRecord(id);
      setHistory((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError({
        title: "Delete failed",
        message: "Failed to delete that history record. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weather Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Built by Vu Chau</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input
            className="px-3 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter city, zip, or landmark"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={handleShowHistory}
            disabled={historyLoading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {historyLoading ? "Loading..." : "History"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">{error.title}</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          <span className="ml-3 text-gray-500">Fetching weather data...</span>
        </div>
      )}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <WeatherCard data={{ ...data.current, city: data.city }} />
          </div>

          {data.airQuality && (
            <div className="bg-white p-4 rounded-xl shadow">
              <AirQuality data={data.airQuality} />
            </div>
          )}

          {data.insight && (
            <div className="bg-white p-4 rounded-xl shadow">
              <Insight text={data.insight} />
            </div>
          )}

          <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <WeatherChart forecast={data.forecast} />
          </div>

          <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <Forecast forecast={data.forecast} />
          </div>

          <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-3">
            <Map lat={data.lat} lon={data.lon} city={data.city} />
          </div>

          {data.videos?.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-3">
              <YouTube videos={data.videos} />
            </div>
          )}
        </div>
      )}

      {showHistory && (
        <div className="mt-8 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Search History</h2>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Export CSV
              </button>
              <button
                onClick={exportJSON}
                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Export JSON
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500">No history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">City</th>
                    <th className="p-2 border">Temp (°F)</th>
                    <th className="p-2 border">Humidity (%)</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{r.id}</td>
                      <td className="p-2 border">{r.city}</td>
                      <td className="p-2 border">{Math.round(r.temperature)}</td>
                      <td className="p-2 border">{r.humidity}</td>
                      <td className="p-2 border capitalize">{r.description}</td>
                      <td className="p-2 border">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <section className="mt-10 rounded-xl bg-white p-5 shadow">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-gray-500 mb-2">About PM Accelerator</p>
          <p className="text-sm leading-6 text-gray-600">
            Product Manager Accelerator supports product management professionals through every
            stage of their careers, from entry-level candidates to senior product leaders. The
            program helps ambitious PMs build product, leadership, interview, and career skills
            through structured learning, mentorship, and a strong professional community.
          </p>
          <a
            href="https://www.linkedin.com/school/pmaccelerator/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Product Manager Accelerator on LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
