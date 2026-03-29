import React from 'react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useThemeContext } from '../../context/ThemeContext';

import RainParticles from '../particles/RainParticles';
import SnowParticles from '../particles/SnowParticles';
import CloudDrift from '../particles/CloudDrift';
import ThunderEffect from '../particles/ThunderEffect';
import Starfield from '../particles/Starfield';
import SunRays from '../particles/SunRays';
import TornadoVortex from '../particles/TornadoVortex';

export default function BackgroundScene() {
    const { currentWeather } = useWeatherContext();
    const { isDay } = useThemeContext();

    if (!currentWeather) return <div className="background-scene default-gradient"></div>;

    const conditionId = currentWeather.weather[0].id;
    const cloudPercent = currentWeather.clouds ? currentWeather.clouds.all : 0;

    // Determine active effects based on OpenWeatherMap ID ranges
    const isThunderstorm = conditionId >= 200 && conditionId <= 232;
    const isDrizzle = conditionId >= 300 && conditionId <= 321;
    const isRain = conditionId >= 500 && conditionId <= 531;
    const isSnow = conditionId >= 600 && conditionId <= 622;
    const isAtmosphere = conditionId >= 701 && conditionId <= 771; // Mist, Smoke, Haze, Dust, Fog
    const isTornado = conditionId === 781;
    const isClear = conditionId === 800;

    // Calculate cloud density based on API percentage
    let cloudDensity = null;
    if (cloudPercent > 10 && cloudPercent <= 30) cloudDensity = 'few';
    else if (cloudPercent > 30 && cloudPercent <= 60) cloudDensity = 'scattered';
    else if (cloudPercent > 60 && cloudPercent <= 90) cloudDensity = 'broken';
    else if (cloudPercent > 90) cloudDensity = 'overcast';

    return (
        <div className="background-scene">
            {/* LAYER 1: Base environmental color layer tied to AppShell themeClass anyway */}
            <div className="environmental-gradient"></div>

            {/* LAYER 2: Atmospheric texture (CSS noise grain overlay, 3% opacity) */}
            <div
                className="noise-grain-overlay"
                style={{
                    position: 'absolute', inset: 0, opacity: 0.03, zIndex: 1, pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* LAYER 3: Particle system (rain/snow/stars) */}
            <div className="particle-systems-layer" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                {isClear && isDay && <SunRays />}
                {isClear && !isDay && <Starfield />}
                {(isRain || isDrizzle || isThunderstorm) && <RainParticles />}
                {isSnow && <SnowParticles />}
                {isThunderstorm && <ThunderEffect />}
                {isTornado && <TornadoVortex />}
                {isAtmosphere && <div className="fog-overlay"></div>}
            </div>

            {/* LAYER 4: Cloud Parallax (Z-index 3 to float above other particles but under UI) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
                {cloudDensity && <CloudDrift density={cloudDensity} />}
            </div>

            {/* LAYER 5: Front Vignette */}
            <div
                className="vignette-overlay"
                style={{
                    position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 150%)'
                }}
            />
        </div>
    );
}
