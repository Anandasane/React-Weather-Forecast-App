import { useState, useCallback } from 'react';

export function useGeolocation() {
    const [location, setLocation] = useState({
        coordinates: null, // {lat, lon}
        loaded: false,
        error: null,
    });

    const onSuccess = (locationData) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: locationData.coords.latitude,
                lon: locationData.coords.longitude,
            },
            error: null,
        });
    };

    const onError = (error) => {
        setLocation({
            loaded: true,
            coordinates: null,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    const getLocation = useCallback(() => {
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation is not supported by your browser.",
            });
            return;
        }

        setLocation((state) => ({ ...state, loaded: false, error: null }));
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    }, []);

    return { ...location, getLocation };
}
