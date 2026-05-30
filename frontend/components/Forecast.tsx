interface ForecastDay {
  date: string;
  temp: number;
  tempMin?: number;
  tempMax?: number;
  description: string;
  icon?: string;
}

interface ForecastProps {
  forecast: ForecastDay[];
}

export default function Forecast({ forecast }: ForecastProps) {
  if (!forecast || forecast.length === 0) return null;

  const days = forecast.slice(0, 5);

  return (
    <div>
      <h3 className="font-semibold mb-3">5-Day Forecast</h3>

      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-5 gap-4">
        {days.map((day, i) => (
          <div
            key={i}
            className="rounded-lg border bg-gray-50 p-3 text-center"
          >
            <p className="min-h-[20px] text-sm font-medium">{day.date}</p>
            {day.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt=""
                aria-hidden="true"
                className="mx-auto h-10 w-10"
                width={40}
                height={40}
              />
            )}
            <p className="min-h-[32px] text-xs capitalize text-gray-600">{day.description}</p>
            <p className="mt-1 text-lg font-bold">{day.temp}°F</p>

            {day.tempMin !== undefined && day.tempMax !== undefined && (
              <p className="mt-1 text-xs text-gray-500">
                {day.tempMin}° / {day.tempMax}°
              </p>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
