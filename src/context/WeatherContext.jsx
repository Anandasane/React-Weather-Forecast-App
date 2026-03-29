import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGeolocation } from '../hooks/useGeolocation';
import {
    useCurrentWeather,
    useForecast,
    useAirPollution,
    useReverseGeocode
} from '../hooks/useWeather';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    // User Preferences
    const [units, setUnits] = useLocalStorage('skyglass_units', 'metric');
    const [recentLocations, setRecentLocations] = useLocalStorage('skyglass_recents', []);

    // Active Location State: fallback to London if nothing else
    const [location, setLocation] = useState({
        name: 'London',
        lat: 51.5074,
        lon: -0.1278
    });

    const {
        coordinates: geoCoords,
        loaded: geoLoaded,
        error: geoError,
        getLocation: requestGeolocation
    } = useGeolocation();

    // If GPS found, update the active location
    useEffect(() => {
        if (geoLoaded && geoCoords && !geoError) {
            setLocation({
                name: 'Current Location', // Will be reverse geocoded later
                lat: geoCoords.lat,
                lon: geoCoords.lon
            });
        }
    }, [geoCoords, geoLoaded, geoError]);

    // Data Fetching Hooks
    const {
        data: currentWeather,
        isLoading: isCurrentLoading,
        error: currentError,
        isSuccess: isCurrentSuccess
    } = useCurrentWeather(location.lat, location.lon, units);

    const {
        data: forecast,
        isLoading: isForecastLoading
    } = useForecast(location.lat, location.lon, units);

    const {
        data: airPollution
    } = useAirPollution(location.lat, location.lon);

    const {
        data: geocodeData
    } = useReverseGeocode(location.lat, location.lon, location.name === 'Current Location');

    // Update name if we reverse geocoded the GPS coords successfully
    useEffect(() => {
        if (geocodeData && geocodeData.length > 0 && location.name === 'Current Location') {
            setLocation(prev => ({ ...prev, name: geocodeData[0].name }));
        }
    }, [geocodeData, location.name]);

    // Actions
    const toggleUnits = () => {
        setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
    };

    const selectLocation = (lat, lon, name) => {
        setLocation({ lat, lon, name });

        // Add to recents, keep only top 5 unique
        setRecentLocations(prev => {
            const filtered = prev.filter(loc => loc.lat !== lat || loc.lon !== lon);
            return [{ lat, lon, name }, ...filtered].slice(0, 5);
        });
    };

    const removeRecentLocation = (lat, lon) => {
        setRecentLocations(prev => prev.filter(loc => loc.lat !== lat || loc.lon !== lon));
    };

    const contextValue = {
        // State
        location,
        units,
        recentLocations,

        // Data
        currentWeather,
        forecast,
        airPollution,

        // Status
        isLoading: isCurrentLoading || isForecastLoading,
        error: currentError || geoError,
        isSuccess: isCurrentSuccess,

        // Actions
        toggleUnits,
        selectLocation,
        removeRecentLocation,
        requestGeolocation
    };

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
};
