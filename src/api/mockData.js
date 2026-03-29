// Fallback mock data when API key is not present

const now = Math.floor(Date.now() / 1000);

export const mockCurrentWeather = {
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    main: { temp: 22.5, feels_like: 24, temp_min: 18, temp_max: 26, humidity: 45 },
    wind: { speed: 12, deg: 270 },
    sys: { sunrise: now - 3600 * 6, sunset: now + 3600 * 6 },
    name: "London",
    timezone: 3600 // +1 offset
};

export const mockForecast = {
    list: Array.from({ length: 40 }).map((_, i) => ({
        dt: now + i * 10800, // 3 hour intervals
        main: {
            temp: 20 + Math.sin(i / 2) * 5,
            temp_min: 19 + Math.sin(i / 2) * 4,
            temp_max: 22 + Math.sin(i / 2) * 6,
        },
        weather: [{ id: (800 + (i % 5)), main: i % 2 === 0 ? 'Clear' : 'Clouds', icon: '01d' }],
        pop: (i % 4 === 0) ? 0.4 : 0
    }))
};

export const mockGeocode = [
    { name: "London", lat: 51.5074, lon: -0.1278, country: "GB", state: "England" },
    { name: "New York", lat: 40.7128, lon: -74.0060, country: "US", state: "NY" },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "JP", state: "Tokyo" }
];
