import React from 'react'
import { useThemeContext } from '../../context/ThemeContext'
import { useWeatherContext } from '../../context/WeatherContext'
import BackgroundScene from './BackgroundScene'

import HeroWeather from '../weather/HeroWeather';
import FeelsLike from '../weather/FeelsLike';
import WindCompass from '../weather/WindCompass';
import AQIGauge from '../weather/AQIGauge';
import SunriseSunset from '../weather/SunriseSunset';

import HourlyForecast from '../forecast/HourlyForecast';
import DailyForecast from '../forecast/DailyForecast';
import SearchBar from '../search/SearchBar';
import RecentCities from '../search/RecentCities';

export default function AppShell() {
    const { themeClass, isDay } = useThemeContext();
    const {
        location,
        currentWeather,
        forecast,
        units,
        toggleUnits,
        isLoading
    } = useWeatherContext();

    return (
        <div className={`app-shell ${themeClass}`}>
            <BackgroundScene />

            <main className="dashboard-container">
                <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="logo">SKYGLASS</h1>
                    {/* SearchBar is now fixed floating pill, RecentCities can stay in header */}
                    <div className="search-section" style={{ marginTop: '40px' }}>
                        <RecentCities />
                    </div>
                </header>

                <SearchBar /> {/* Will render as floating pill */}

                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Gathering atmosphere...</p>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {currentWeather && (
                            <div className="dashboard-left">
                                <HeroWeather
                                    weather={currentWeather}
                                    locationName={location.name}
                                    isDay={isDay}
                                    onToggleUnits={toggleUnits}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <WindCompass
                                        speed={currentWeather.wind.speed}
                                        deg={currentWeather.wind.deg}
                                        unit={units === 'metric' ? 'km/h' : 'mph'}
                                    />
                                    {/* Temporary hardcoded AQI mapping based on OpenWeatherMap API tier limitations unless we fetched it */}
                                    {/* Passing a random 1-5 for visual demonstration since AQI wasn't in the base payload */}
                                    <AQIGauge aqi={Math.floor(Math.random() * 5) + 1} />
                                </div>

                                <SunriseSunset
                                    sys={currentWeather.sys}
                                    timezone={currentWeather.timezone}
                                />

                                <FeelsLike
                                    feelsLike={currentWeather.main.feels_like}
                                    humidity={currentWeather.main.humidity}
                                    uvi={8} // Placeholder UVI
                                />
                            </div>
                        )}

                        {forecast && (
                            <div className="dashboard-right">
                                <HourlyForecast forecastData={forecast} />
                                <DailyForecast forecastData={forecast} />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
