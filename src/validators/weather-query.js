import { HttpError } from '../lib/http-error.js';

export function parseCity(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, 'Query parameter "city" must be a non-empty string', {
      city: value ?? null,
    });
  }

  return value.trim();
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  throw new Error('parseCities is not written yet');
}
