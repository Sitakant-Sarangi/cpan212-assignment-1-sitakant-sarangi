import { config } from '../config.js';
import { Cache } from './cache.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

const weatherCache = new Cache(config.cacheTtlSeconds);

export async function getCityWeather(city) {
  const cacheKey = city.toLocaleLowerCase();
  const cachedSummary = weatherCache.get(cacheKey);
  if (cachedSummary) {
    return { ...cachedSummary, cached: true };
  }

  const location = await geocodeCity(city);
  const forecast = await getForecast(location.latitude, location.longitude);
  const current = forecast.current;
  const daily = forecast.daily;
  const summary = {
    location,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      description: describeWeatherCode(current.weather_code),
    },
    forecast: daily.time.map((date, index) => ({
      date,
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      weatherCode: daily.weather_code[index],
      description: describeWeatherCode(daily.weather_code[index]),
    })),
  };

  weatherCache.set(cacheKey, summary);
  return { ...summary, cached: false };
}

export function getCacheStats() {
  return weatherCache.getStats();
}
