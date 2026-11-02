import { HttpError } from '../lib/http-error.js';

export function parseCity(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, 'Query parameter "city" must be a non-empty string', {
      city: value ?? null,
    });
  }

  return value.trim();
}

export function parseCities(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, 'Query parameter "cities" must be a comma-separated list of at least two city names', {
      cities: value ?? null,
    });
  }

  const cities = value.split(',').map((city) => city.trim());
  if (cities.length < 2 || cities.some((city) => city === '')) {
    throw new HttpError(400, 'Query parameter "cities" must be a comma-separated list of at least two city names', {
      cities: value,
    });
  }

  return cities;
}
