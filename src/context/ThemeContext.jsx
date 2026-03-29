import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeatherContext } from './WeatherContext';
import { useDayNight } from '../hooks/useDayNight';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { currentWeather } = useWeatherContext();
    const dayNightInfo = useDayNight(currentWeather);

    const [themeClass, setThemeClass] = useState('theme-clear-day');

    useEffect(() => {
        if (!currentWeather) return;

        // OWM Weather Codes: https://openweathermap.org/weather-conditions
        const conditionId = currentWeather.weather[0].id;
        const isDay = dayNightInfo.isDay;

        // Default suffix depending on time of day
        const timeSuffix = isDay ? 'day' : 'night';
        let baseTheme = 'clear'; // default fallback

        // Classify conditions based on detailed mapping table
        if (conditionId >= 200 && conditionId <= 232) {
            baseTheme = 'thunderstorm';
        } else if (conditionId >= 300 && conditionId <= 321) {
            baseTheme = 'drizzle';
        } else if (conditionId >= 500 && conditionId <= 531) {
            baseTheme = 'rain';
        } else if (conditionId >= 600 && conditionId <= 622) {
            baseTheme = 'snow';
        } else if (conditionId >= 701 && conditionId <= 771) {
            baseTheme = 'atmosphere'; // fog, haze, smoke
        } else if (conditionId === 781) {
            baseTheme = 'tornado';
        } else if (conditionId === 800) {
            baseTheme = 'clear';
        } else if (conditionId === 801 || conditionId === 802) {
            baseTheme = 'few-scat-clouds';
        } else if (conditionId === 803 || conditionId === 804) {
            baseTheme = 'broken-over-clouds';
        }

        // Apply sunset/sunrise overrides for spectacular golden hour effects if it's clear or partly cloudy
        if (baseTheme === 'clear' || baseTheme === 'few-scat-clouds') {
            if (dayNightInfo.isSunrise) {
                setThemeClass(`theme-sunrise`);
                return;
            }
            if (dayNightInfo.isSunset) {
                setThemeClass(`theme-sunset`);
                return;
            }
        }

        setThemeClass(`theme-${baseTheme}-${timeSuffix}`);

    }, [currentWeather, dayNightInfo]);

    const value = {
        themeClass,
        isDay: dayNightInfo.isDay,
        isSunrise: dayNightInfo.isSunrise,
        isSunset: dayNightInfo.isSunset,
        dayNightRatio: dayNightInfo.ratio
    };

    return (
        <ThemeContext.Provider value={value}>
            <div className={`app-wrapper ${themeClass}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
