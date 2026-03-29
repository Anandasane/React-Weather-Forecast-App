import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function DailyForecast({ forecastData }) {
    if (!forecastData || !forecastData.list) return null;

    // The OWM /forecast endpoint returns 3-hour chunks (40 items = 5 days)
    // We need to group them by day and find daily high/low
    const dailyData = {};

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!dailyData[dayStr]) {
            dailyData[dayStr] = {
                dt: item.dt,
                day: dayStr,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                condition: item.weather[0]
            };
        } else {
            // update min/max
            if (item.main.temp_min < dailyData[dayStr].temp_min) {
                dailyData[dayStr].temp_min = item.main.temp_min;
            }
            if (item.main.temp_max > dailyData[dayStr].temp_max) {
                dailyData[dayStr].temp_max = item.main.temp_max;
            }
        }
    });

    const uniqueDays = Object.values(dailyData).slice(0, 5); // ensure only 5

    return (
        <GlassCard className="daily-forecast">
            <h3>5.Day Forecast</h3>
            <div className="daily-list">
                {uniqueDays.map((day, index) => (
                    <motion.div
                        key={day.day}
                        className="daily-item"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <span className="day-name">{index === 0 ? 'Today' : day.day}</span>
                        <div className="daily-icon-wrapper">
                            {/* Fallback to condition text */}
                            <span className="daily-cond">{day.condition.main}</span>
                        </div>
                        <div className="daily-temps">
                            <span className="low">{Math.round(day.temp_min)}&deg;</span>
                            <div className="temp-bar">
                                <div className="temp-bar-fill" style={{
                                    // Mock gradient width calculation based on temp bounds
                                    width: '60%',
                                    marginLeft: '20%'
                                }}></div>
                            </div>
                            <span className="high">{Math.round(day.temp_max)}&deg;</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}
