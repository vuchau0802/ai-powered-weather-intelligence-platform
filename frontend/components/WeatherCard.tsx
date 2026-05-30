interface WeatherCardProps {
  data: {
    city: string;
    temp: number;
    feelsLike?: number;
    description: string;
    humidity: number;
    icon?: string;
    windSpeed?: number;
  };
}

export default function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">{data.city}</h2>

      <div className="flex items-center gap-3 my-2">
        {data.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            width={64}
            height={64}
          />
        )}
        <p className="text-4xl font-bold">{data.temp}°F</p>
      </div>

      <p className="text-gray-600 capitalize mb-2">{data.description}</p>

      <div className="text-sm text-gray-500 space-y-1">
        <p>Humidity: {data.humidity}%</p>
        {data.feelsLike !== undefined && <p>Feels like: {data.feelsLike}°F</p>}
        {data.windSpeed !== undefined && <p>Wind: {data.windSpeed} mph</p>}
      </div>
    </div>
  );
}
