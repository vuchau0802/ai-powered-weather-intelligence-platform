interface AirQualityData {
  aqi: number;
  pm2_5: number;
  pm10: number;
}

interface AirQualityProps {
  data: AirQualityData;
}

function aqiLabel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-green-600" };
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-500" };
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-500" };
  return { label: "Very Unhealthy", color: "text-purple-700" };
}

export default function AirQuality({ data }: AirQualityProps) {
  if (!data) return null;

  const { label, color } = aqiLabel(data.aqi ?? 0);

  return (
    <div>
      <h3 className="font-semibold mb-2">Air Quality</h3>
      <p className={`text-lg font-bold ${color}`}>
        AQI: {data.aqi ?? "N/A"} — {label}
      </p>
      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>PM2.5: {data.pm2_5 ?? "N/A"} µg/m³</p>
        <p>PM10: {data.pm10 ?? "N/A"} µg/m³</p>
      </div>
    </div>
  );
}