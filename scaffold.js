import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const structure = {
    'public': ['favicon.svg'],
    'src': [
        'main.jsx',
        'App.jsx',
        'index.css'
    ],
    'src/context': [
        'WeatherContext.jsx',
        'ThemeContext.jsx'
    ],
    'src/hooks': [
        'useWeather.js',
        'useGeolocation.js',
        'useDayNight.js',
        'useLocalStorage.js'
    ],
    'src/api': [
        'weatherService.js',
        'endpoints.js'
    ],
    'src/components/layout': [
        'AppShell.jsx',
        'BackgroundScene.jsx'
    ],
    'src/components/weather': [
        'HeroWeather.jsx',
        'TemperatureDisplay.jsx',
        'WeatherIcon3D.jsx',
        'FeelsLike.jsx',
        'WindCompass.jsx',
        'SunriseSunset.jsx',
        'AQIGauge.jsx'
    ],
    'src/components/forecast': [
        'HourlyForecast.jsx',
        'DailyForecast.jsx',
        'ForecastCard.jsx'
    ],
    'src/components/particles': [
        'RainParticles.jsx',
        'SnowParticles.jsx',
        'CloudDrift.jsx',
        'ThunderEffect.jsx',
        'SunRays.jsx'
    ],
    'src/components/search': [
        'SearchBar.jsx',
        'SearchSuggestions.jsx',
        'RecentCities.jsx'
    ],
    'src/components/ui': [
        'GlassCard.jsx',
        'DataPill.jsx',
        'LoadingAtmosphere.jsx',
        'ErrorBoundary.jsx'
    ],
    'src/utils': [
        'weatherThemes.js',
        'formatters.js',
        'weatherConditions.js'
    ],
    'src/constants': [
        'weatherCodes.js',
        'themes.js'
    ]
};

const basePath = __dirname;

// Create directories and files
Object.keys(structure).forEach(dir => {
    const fullDirPath = path.join(basePath, dir);
    if (!fs.existsSync(fullDirPath)) {
        fs.mkdirSync(fullDirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }

    structure[dir].forEach(file => {
        const filePath = path.join(fullDirPath, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
            console.log(`Created file: ${path.join(dir, file)}`);
        }
    });
});

// Also create .env
if (!fs.existsSync(path.join(basePath, '.env'))) {
    fs.writeFileSync(path.join(basePath, '.env'), 'VITE_OWM_API_KEY=\n');
}

console.log('Scaffolding complete.');
