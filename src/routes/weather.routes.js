import { Router } from 'express';
import { HttpError } from '../lib/http-error.js';
import { getCityWeather } from '../lib/weather.js';
import { parseCities, parseCity } from '../validators/weather-query.js';

export const weatherRouter = Router();

weatherRouter.get('/weather', async (req, res) => {
  const city = parseCity(req.query.city);
  const data = await getCityWeather(city);
  res.json({ data, attribution: 'https://open-meteo.com/' });
});

weatherRouter.get('/compare', async (req, res) => {
  const cities = parseCities(req.query.cities);
  const outcomes = await Promise.allSettled(cities.map((city) => getCityWeather(city)));
  let fulfilled = 0;
  let rejected = 0;

  const results = outcomes.map((outcome, index) => {
    const city = cities[index];
    if (outcome.status === 'fulfilled') {
      fulfilled += 1;
      return { city, status: 'fulfilled', data: outcome.value };
    }

    rejected += 1;
    if (!(outcome.reason instanceof HttpError)) {
      console.error(outcome.reason);
    }

    return {
      city,
      status: 'rejected',
      error: {
        message: outcome.reason instanceof HttpError ? outcome.reason.message : 'Internal server error',
        status: outcome.reason instanceof HttpError ? outcome.reason.status : 500,
      },
    };
  });

  res.json({
    data: {
      cities: results,
      summary: { total: cities.length, fulfilled, rejected },
    },
    attribution: 'https://open-meteo.com/',
  });
});
