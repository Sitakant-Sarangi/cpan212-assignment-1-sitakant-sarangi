import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

async function fetchJson(url) {
  const signal = AbortSignal.timeout(config.upstreamTimeoutMs);
  let response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new HttpError(504, 'Open-Meteo request timed out');
    }
    throw new HttpError(502, 'Unable to reach Open-Meteo');
  }

  if (!response.ok) {
    throw new HttpError(502, `Open-Meteo returned HTTP ${response.status}`);
  }

  try {
    return await response.json();
  } catch (error) {
    if (signal.aborted && signal.reason?.name === 'TimeoutError') {
      throw new HttpError(504, 'Open-Meteo request timed out');
    }
    throw new HttpError(502, 'Open-Meteo returned an invalid JSON response');
  }
}

export async function geocodeCity(name) {
  const params = new URLSearchParams({
    name,
    count: '1',
    language: 'en',
    format: 'json',
  });
  const data = await fetchJson(`${config.geocodingUrl}/search?${params}`);
  const result = data.results?.[0];

  if (!result) {
    throw new HttpError(404, `No matching city found for "${name}"`);
  }

  return {
    name: result.name,
    region: result.admin1 ?? null,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

export async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '3',
    timezone: 'auto',
  });

  return fetchJson(`${config.forecastUrl}/forecast?${params}`);
}
