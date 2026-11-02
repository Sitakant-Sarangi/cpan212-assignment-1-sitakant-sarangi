# City Weather API

TODO (you): Tt displays current weather data and a 3-day forecast for one city. It also support multi-city lookups (2–5 cities) .

## Run it

TODO (you): the commands to install and start it, including copying `.env.example` to `.env`.

## Environment variables

TODO (you): 
a table with every variable from `.env.example`, its default, and what it controls.

Variable                               Default                                Controls

PORT                                     4000                             The port the server listens on

GEOCODING_URL            https://geocoding-api.open-meteo.com/v1         Base URL of the geocoding API

FORECAST_URL                https://api.open-meteo.com/v1                   Base URL of the forecast API

UPSTREAM_TIMEOUT_MS               5000                                   How long to wait for each Open-Meteo request

CACHE_TTL_SECONDS                 600                                   How long a cached answer stays valid


prevents hardcoding of values

## Endpoints

TODO (you): each endpoint with an example request and a short description of the response.

## Testing

TODO (you): one `curl` command for each of the 10 requests on the assignment page, with the status
code it should get on a freshly started server. On Windows, run these in Git Bash. An example to copy:

```bash
# Weather for a city: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
```

## Data source

TODO (you): credit Open-Meteo with a link to https://open-meteo.com/.

## AI use


TODO (you): used AI and Web reference for Geocoding and Promise"
