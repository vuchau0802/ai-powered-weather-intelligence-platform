"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ForecastDay {
  date: string;
  temp: number;
  tempMin?: number;
  tempMax?: number;
}

interface WeatherChartProps {
  forecast: ForecastDay[];
}

export default function WeatherChart({ forecast }: WeatherChartProps) {
  if (!forecast || forecast.length === 0) return null;

  const chartData = forecast.slice(0, 5).map((d) => ({
    date: d.date,
    "Avg Temp": d.temp,
    ...(d.tempMin !== undefined && { "Min Temp": d.tempMin }),
    ...(d.tempMax !== undefined && { "Max Temp": d.tempMax }),
  }));

  return (
    <div>
      <h3 className="font-semibold mb-2">Temperature Trend (5 days)</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis unit="°F" tick={{ fontSize: 11 }} />
          <Tooltip formatter={(val: number) => `${val}°F`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Avg Temp"
            stroke="#111827"
            strokeWidth={3}
            dot={{ r: 4, fill: "#111827" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Max Temp"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Min Temp"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeDasharray="2 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
