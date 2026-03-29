import { useQuery } from '@tanstack/react-query';
import { weatherAPI } from '../api/weatherService';

export const useCurrentWeather = (lat, lon, units = 'metric', enabled = true) => {
    return useQuery({
        queryKey: ['currentWeather', lat, lon, units],
        queryFn: () => weatherAPI.getCurrentWeather(lat, lon, units),
        enabled: enabled && !!lat && !!lon,
    });
};

export const useForecast = (lat, lon, units = 'metric', enabled = true) => {
    return useQuery({
        queryKey: ['forecast', lat, lon, units],
        queryFn: () => weatherAPI.getForecast(lat, lon, units),
        enabled: enabled && !!lat && !!lon,
    });
};

export const useAirPollution = (lat, lon, enabled = true) => {
    return useQuery({
        queryKey: ['airPollution', lat, lon],
        queryFn: () => weatherAPI.getAirPollution(lat, lon),
        enabled: enabled && !!lat && !!lon,
    });
};

export const useReverseGeocode = (lat, lon, enabled = true) => {
    return useQuery({
        queryKey: ['reverseGeocode', lat, lon],
        queryFn: () => weatherAPI.reverseGeocode(lat, lon),
        enabled: enabled && !!lat && !!lon,
    });
};

export const useCitySearch = (query, enabled = false) => {
    return useQuery({
        queryKey: ['citySearch', query],
        queryFn: () => weatherAPI.searchCity(query),
        enabled: enabled && !!query && query.length > 2,
        staleTime: 1000 * 60 * 60 * 24, // cache searches for a day
    });
};
