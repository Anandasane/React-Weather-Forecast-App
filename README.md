# 🌤️ Skyglass: Immersive Weather App

An advanced, production-grade weather application built with modern web technologies including React, Vite, and Framer Motion. Skyglass features a stunning 3D glassmorphic aesthetic dynamic weather visualizations, and comprehensive weather data fetching.

## 🚀 Features

- **Immersive 3D UI**: A modern 'glassmorphism' design combining frosted glass effects and vibrant atmospheric aesthetics.
- **Dynamic Backgrounds & Particles**: Animated particle effects (e.g., Tornado Vortex) based on real-time weather conditions.
- **Real-time Weather Data**: Integrated directly with the OpenWeatherMap API for live and highly accurate updates.
- **Interactive Dashboards**:
  - Detailed interactive hero weather display
  - Hourly forecast with visual trendlines
  - Global sunrise/sunset tracker
  - Dynamic wind direction compass
- **Location & Search**: Advanced responsive city search and automatic geolocation support.
- **Smooth Animations**: Powered robustly by Framer Motion for seamless page transitions and rich micro-interactions.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management & Fetching**: [React Query](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI & Styling**: Modern CSS Features & extensive Glassmorphic Utilities
- **Weather API**: [OpenWeatherMap API](https://openweathermap.org/api)

## 🏃‍♂️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed along with `npm` or `yarn`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anandasane/React-Weather-Forecast-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd React-Weather-Forecast-App
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of your project and configure your project keys:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
```

### Running Locally

Start the Vite development server in the root directory:

```bash
npm run dev
```

Your app will be automatically running at `http://localhost:5173/`.

## 📦 Building for Production

To create an optimized minified production build:

```bash
npm run build
```

You can preview the production build locally before deploying by using:

```bash
npm run preview
```
