import axios from 'axios';
import { ENDPOINTS, OWM_API_KEY } from './endpoints';
import { mockCurrentWeather, mockForecast, mockGeocode } from './mockData';

const apiClient = axios.create({
    timeout: 10000,
});

export const weatherAPI = {
    // Get current weather by lat/lon
    getCurrentWeather: async (lat, lon, units = 'metric') => {
        if (!OWM_API_KEY) {
            console.warn("No OWM_API_KEY found, using fallback mock weather data.");
            return Promise.resolve(mockCurrentWeather);
        }
        const { data } = await apiClient.get(ENDPOINTS.CURRENT_WEATHER, {
            params: { lat, lon, appid: OWM_API_KEY, units },
        });
        return data;
    },

    // Get 5 day / 3 hour forecast by lat/lon
    getForecast: async (lat, lon, units = 'metric') => {
        if (!OWM_API_KEY) return Promise.resolve(mockForecast);
        const { data } = await apiClient.get(ENDPOINTS.FORECAST, {
            params: { lat, lon, appid: OWM_API_KEY, units },
        });
        return data;
    },

    // Get air pollution data by lat/lon
    getAirPollution: async (lat, lon) => {
        if (!OWM_API_KEY) return Promise.resolve({ list: [{ main: { aqi: 2 } }] });
        const { data } = await apiClient.get(ENDPOINTS.AIR_POLLUTION, {
            params: { lat, lon, appid: OWM_API_KEY },
        });
        return data;
    },

    // Get city name from coordinates
    reverseGeocode: async (lat, lon) => {
        if (!OWM_API_KEY) return Promise.resolve([mockGeocode[0]]);
        const { data } = await apiClient.get(ENDPOINTS.GEO_REVERSE, {
            params: { lat, lon, limit: 1, appid: OWM_API_KEY },
        });
        return data;
    },

    // Get coordinates from city name search
    searchCity: async (query) => {
        if (!OWM_API_KEY) return Promise.resolve(mockGeocode.filter(c => c.name.toLowerCase().includes(query.toLowerCase())));
        const { data } = await apiClient.get(ENDPOINTS.GEO_DIRECT, {
            params: { q: query, limit: 5, appid: OWM_API_KEY },
        });
        return data;
    },
};
