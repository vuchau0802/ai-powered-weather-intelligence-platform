"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = exports.WeatherServiceError = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WeatherServiceError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "WeatherServiceError";
        this.statusCode = statusCode;
    }
}
exports.WeatherServiceError = WeatherServiceError;
const openWeatherErrorMessage = "OpenWeather rejected the API key. Check OPENWEATHER_API_KEY and make sure it is active for the Current Weather and 5 Day Forecast APIs.";
const getErrorStatus = (err) => {
    return axios_1.default.isAxiosError(err) ? err.response?.status : undefined;
};
const getOpenWeather = async (url, params) => {
    try {
        return await axios_1.default.get(url, { params });
    }
    catch (err) {
        if (getErrorStatus(err) === 401) {
            throw new WeatherServiceError(openWeatherErrorMessage, 502);
        }
        if (getErrorStatus(err) === 404) {
            throw new WeatherServiceError(`Location "${params.q || "requested city"}" was not found. Try another city name.`, 404);
        }
        throw err;
    }
};
const formatForecastDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};
const buildForecast = (items) => {
    const byDay = new Map();
    for (const item of items) {
        const dateKey = new Date(item.dt * 1000).toISOString().slice(0, 10);
        byDay.set(dateKey, [...(byDay.get(dateKey) || []), item]);
    }
    return Array.from(byDay.values())
        .slice(0, 5)
        .map((dayItems) => {
        const representative = dayItems.find((item) => item.dt_txt?.includes("12:00:00")) ||
            dayItems[Math.floor(dayItems.length / 2)];
        const averageTemp = dayItems.reduce((sum, item) => sum + item.main.temp, 0) / dayItems.length;
        const temps = dayItems.flatMap((item) => [item.main.temp_min, item.main.temp_max]);
        return {
            date: formatForecastDate(representative.dt),
            temp: Math.round(averageTemp),
            tempMin: Math.round(Math.min(...temps)),
            tempMax: Math.round(Math.max(...temps)),
            description: representative.weather[0].description,
            icon: representative.weather[0].icon,
        };
    });
};
const getWeather = async (city) => {
    if (!city || city.trim() === "") {
        throw new WeatherServiceError("City name is required", 400);
    }
    const weatherKey = process.env.OPENWEATHER_API_KEY;
    const geoKey = process.env.OPENCAGE_API_KEY;
    const ytKey = process.env.YOUTUBE_API_KEY;
    if (!weatherKey)
        throw new WeatherServiceError("Missing OPENWEATHER_API_KEY in environment", 500);
    let lat;
    let lon;
    let name;
    if (process.env.ENABLE_GEOCODING === "true" && geoKey) {
        const geo = await axios_1.default.get("https://api.opencagedata.com/geocode/v1/json", {
            params: { q: city, key: geoKey, limit: 1 },
        });
        if (!geo.data.results || geo.data.results.length === 0) {
            throw new WeatherServiceError(`Location "${city}" was not found. Try another city name.`, 404);
        }
        lat = geo.data.results[0].geometry.lat;
        lon = geo.data.results[0].geometry.lng;
        name = geo.data.results[0].formatted;
    }
    else {
        const currentByCity = await getOpenWeather("https://api.openweathermap.org/data/2.5/weather", {
            q: city,
            units: "imperial",
            appid: weatherKey,
        });
        lat = currentByCity.data.coord.lat;
        lon = currentByCity.data.coord.lon;
        name = currentByCity.data.name;
    }
    const [currentWeather, forecastWeather] = await Promise.all([
        getOpenWeather("https://api.openweathermap.org/data/2.5/weather", {
            lat,
            lon,
            units: "imperial",
            appid: weatherKey,
        }),
        getOpenWeather("https://api.openweathermap.org/data/2.5/forecast", {
            lat,
            lon,
            units: "imperial",
            appid: weatherKey,
        }),
    ]);
    const current = currentWeather.data;
    let airQuality = null;
    if (process.env.ENABLE_AIR_QUALITY === "true") {
        try {
            const air = await axios_1.default.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
                params: { latitude: lat, longitude: lon, current: "pm10,pm2_5,us_aqi" },
            });
            airQuality = {
                aqi: air.data.current.us_aqi,
                pm2_5: air.data.current.pm2_5,
                pm10: air.data.current.pm10,
            };
        }
        catch {
            console.warn("Air quality fetch failed, continuing without it");
        }
    }
    let videos = [];
    if (process.env.ENABLE_YOUTUBE === "true" && ytKey) {
        try {
            const yt = await axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: `${city} travel`,
                    type: "video",
                    maxResults: 2,
                    key: ytKey,
                },
            });
            videos = yt.data.items.map((v) => ({
                title: v.snippet.title,
                videoId: v.id.videoId,
            }));
        }
        catch {
            console.warn("YouTube fetch failed, continuing without it");
        }
    }
    const aqi = airQuality ? airQuality.aqi : 0;
    let insight = "Weather looks normal.";
    if (aqi > 150)
        insight = "Air quality is very unhealthy. Avoid outdoor activity.";
    else if (aqi > 100)
        insight = "Air quality is unhealthy for sensitive groups. Limit outdoor activity.";
    else if (current.main.temp > 95)
        insight = "High heat warning. Stay hydrated and avoid peak sun hours.";
    else if (current.main.temp < 32)
        insight = "Freezing conditions. Dress in layers and watch for ice.";
    else if (current.weather[0].main === "Rain")
        insight = "Rain expected. Bring an umbrella.";
    else if (current.weather[0].main === "Snow")
        insight = "Snow expected. Allow extra travel time.";
    else if (current.main.temp > 82)
        insight = "Warm day ahead. Sunscreen recommended.";
    await prisma.weatherSearch.create({
        data: {
            city: name,
            latitude: lat,
            longitude: lon,
            temperature: current.main.temp,
            humidity: current.main.humidity,
            description: current.weather[0].description,
        },
    });
    return {
        city: name,
        lat,
        lon,
        current: {
            temp: Math.round(current.main.temp),
            feelsLike: Math.round(current.main.feels_like),
            humidity: current.main.humidity,
            description: current.weather[0].description,
            icon: current.weather[0].icon,
            windSpeed: current.wind.speed,
        },
        forecast: buildForecast(forecastWeather.data.list),
        airQuality,
        videos,
        insight,
    };
};
exports.getWeather = getWeather;
