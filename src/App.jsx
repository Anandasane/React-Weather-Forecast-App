import React from 'react'
import { WeatherProvider, useWeatherContext } from './context/WeatherContext'
import { ThemeProvider } from './context/ThemeContext'
import AppShell from './components/layout/AppShell'

// A small inner component so we can consume the contexts before rendering the shell
function AppInner() {
  const { location, currentWeather, isLoading, isSuccess, error } = useWeatherContext();

  if (isLoading && !currentWeather) {
    return (
      <div className="startup-loading">
        <h1>Atmosphere Loading...</h1>
        {/* We will replace this with a proper Glass Loading spinner later */}
      </div>
    );
  }

  // Debug snippet just to verify API response on load
  if (isSuccess && currentWeather) {
    console.log('Weather Loaded for:', location.name, currentWeather);
  }

  return <AppShell />
}

function App() {
  return (
    <WeatherProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </WeatherProvider>
  )
}

export default App
