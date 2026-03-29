export const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;
export const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0';

export const ENDPOINTS = {
    CURRENT_WEATHER: `${OWM_BASE_URL}/weather`,
    FORECAST: `${OWM_BASE_URL}/forecast`,
    GEO_REVERSE: `${GEO_BASE_URL}/reverse`,
    GEO_DIRECT: `${GEO_BASE_URL}/direct`,
    AIR_POLLUTION: `${OWM_BASE_URL}/air_pollution`,
};
