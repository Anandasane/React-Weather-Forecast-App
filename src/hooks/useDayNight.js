import { useMemo, useState } from 'react';

export function useDayNight(weatherData) {
    const [now] = useState(() => Math.floor(Date.now() / 1000));

    return useMemo(() => {
        if (!weatherData || !weatherData.sys) return { isDay: true, ratio: 1 };

        const { sunrise, sunset } = weatherData.sys;

        // Calculate if it's currently day or night
        const isDay = now >= sunrise && now < sunset;

        // Calculate a ratio (0 to 1) of how far along the day or night we are
        // This could be used for dynamic sky gradients (e.g. golden hour)
        let ratio = 0;

        if (isDay) {
            // Day ratio: 0 at sunrise, 1 at sunset
            const dayLength = sunset - sunrise;
            ratio = (now - sunrise) / dayLength;
        } else {
            // Night ratio: 0 at sunset, 1 at sunrise (the next day)
            // For simplicity, we just check how far we are from the last sunset
            // A full implementation would need the next day's sunrise
            // We will default to night mode constant for now
            ratio = 0.5;
        }

        // Determine golden hour (e.g., first and last 10% of daylight)
        const isSunrise = isDay && ratio < 0.1;
        const isSunset = isDay && ratio > 0.9;

        return {
            isDay,
            isSunrise,
            isSunset,
            ratio,
            sunriseTime: sunrise * 1000,
            sunsetTime: sunset * 1000,
        };
    }, [weatherData, now]);
}
