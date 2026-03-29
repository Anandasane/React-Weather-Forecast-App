import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function HourlyForecast({ forecastData }) {
    const scrollRef = useRef(null);
    const [pathData, setPathData] = useState('');
    const [points, setPoints] = useState([]);

    if (!forecastData || !forecastData.list) return null;

    // Grab the next 12 items (36 hours) for a good scroll deck
    const nextHours = forecastData.list.slice(0, 12);

    const formatHour = (dt) => {
        const date = new Date(dt * 1000);
        return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    };

    // Card width + gap = 80px + 16px (1rem gap)
    const cardStep = 96;

    useEffect(() => {
        // Calculate the bezier curve for the temperature trend
        const temps = nextHours.map(item => item.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        const range = maxTemp - minTemp || 1; // avoid / 0

        // SVG drawing area is roughly 120px tall, positioned behind cards
        const height = 120;

        // Map temperatures to SVG Y coordinates (inverted so higher temp = lower Y)
        const newPoints = temps.map((temp, i) => {
            const x = (i * cardStep) + (80 / 2); // Center of each 80px card
            // Add padding so curve doesn't hit absolute top/bottom
            const normalizedY = ((temp - minTemp) / range);
            const y = height - (normalizedY * (height - 40)) - 20;
            return { x, y, temp: Math.round(temp) };
        });

        // Generate smooth Bezier curve string
        if (newPoints.length > 0) {
            let d = `M ${newPoints[0].x} ${newPoints[0].y}`;

            for (let i = 0; i < newPoints.length - 1; i++) {
                const current = newPoints[i];
                const next = newPoints[i + 1];

                // Control points for smooth bezier (horizontal tangents)
                const ctrl1X = current.x + (next.x - current.x) / 2;
                const ctrl1Y = current.y;
                const ctrl2X = current.x + (next.x - current.x) / 2;
                const ctrl2Y = next.y;

                d += ` C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${next.x} ${next.y}`;
            }

            setPathData(d);
            setPoints(newPoints);
        }

    }, [forecastData]);

    return (
        <GlassCard style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>Hourly Outlook</h3>

            {/* Left/Right scroll fade masks */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px',
                background: 'linear-gradient(to right, rgba(15,23,42,0.6), transparent)', zIndex: 5, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px',
                background: 'linear-gradient(to left, rgba(15,23,42,0.6), transparent)', zIndex: 5, pointerEvents: 'none'
            }} />

            <div
                ref={scrollRef}
                style={{
                    display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem',
                    scrollBehavior: 'smooth', scrollSnapType: 'x mandatory',
                    position: 'relative' // relative for absolute SVG child
                }}
                className="custom-scrollbar"
            >
                {/* Background SVG Trendline */}
                <svg
                    style={{
                        position: 'absolute', top: '10px', left: 0,
                        width: `${nextHours.length * cardStep}px`, height: '120px',
                        zIndex: 0, pointerEvents: 'none'
                    }}
                >
                    <path
                        d={pathData}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Forecast Cards */}
                {nextHours.map((item, index) => {
                    const pop = item.pop || 0; // Probability of precipitation (0-1)
                    const isCurrent = index === 0;

                    return (
                        <motion.div
                            key={item.dt}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                minWidth: '80px', width: '80px', flexShrink: 0,
                                padding: '1rem 0.5rem',
                                background: isCurrent ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '20px', border: isCurrent ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                zIndex: 1, scrollSnapAlign: 'start'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, background: 'rgba(255,255,255,0.2)' }}
                        >
                            <span style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                {isCurrent ? 'Now' : formatHour(item.dt)}
                            </span>

                            {/* Tiny representation of weather */}
                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                alt={item.weather[0].main}
                                style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                            />

                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                {Math.round(item.main.temp)}&deg;
                            </span>

                            {/* Precipitation Bar */}
                            {pop > 0 && (
                                <div style={{
                                    width: '30px', height: '4px', background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${pop * 100}%`, height: '100%',
                                        background: '#4facfe', borderRadius: '2px'
                                    }} />
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </GlassCard>
    );
}
