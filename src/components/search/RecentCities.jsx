import React from 'react';
import { useWeatherContext } from '../../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecentCities() {
    const { recentLocations, selectLocation, removeRecentLocation } = useWeatherContext();

    if (!recentLocations || recentLocations.length === 0) return null;

    return (
        <div className="recent-cities">
            <AnimatePresence>
                {recentLocations.map((loc) => (
                    <motion.div
                        key={`${loc.lat}-${loc.lon}`}
                        className="recent-chip"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        onClick={() => selectLocation(loc.lat, loc.lon, loc.name)}
                    >
                        {loc.name}
                        <button
                            className="remove-chip"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeRecentLocation(loc.lat, loc.lon);
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
