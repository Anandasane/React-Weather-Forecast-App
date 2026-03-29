import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function AQIGauge({ aqi }) {
    // OpenWeatherMap AQI values: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    // Map these to our 0-300 scale for the 270 degree gauge visual
    const aqiMapping = {
        1: { value: 25, label: "Good", color: "#22c55e" },
        2: { value: 75, label: "Fair", color: "#facc15" },
        3: { value: 125, label: "Moderate", color: "#f97316" },
        4: { value: 175, label: "Poor", color: "#ef4444" },
        5: { value: 250, label: "Hazardous", color: "#7f1d1d" },
    };

    const currentData = aqiMapping[aqi] || aqiMapping[1];

    // We want the needle to animate from 0 on mount
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        // Trigger spring animation after mount
        const timeout = setTimeout(() => {
            setAnimatedValue(currentData.value);
        }, 100);
        return () => clearTimeout(timeout);
    }, [currentData.value]);

    // Calculate rotation for 270 degree arc (-135 to +135 degrees)
    // Scale 0-300 maps to -135 to 135
    const rotation = -135 + (Math.min(animatedValue, 300) / 300) * 270;

    return (
        <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ alignSelf: 'flex-start', margin: '0 0 1rem 0' }}>Air Quality</h3>

            <div style={{ position: 'relative', width: '160px', height: '140px', display: 'flex', justifyContent: 'center' }}>
                {/* SVG Gauge Background */}
                <svg width="160" height="160" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {/* Define gradients for the stroke */}
                    <defs>
                        <linearGradient id="aqi-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="25%" stopColor="#facc15" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="75%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#7f1d1d" />
                        </linearGradient>
                    </defs>

                    {/* Background track (grey) - 270 arc */}
                    <path
                        d="M 20 80 A 45 45 0 1 1 80 80"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Colored track overlay */}
                    <path
                        d="M 20 80 A 45 45 0 1 1 80 80"
                        fill="none"
                        stroke="url(#aqi-grad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeOpacity="0.8"
                    />
                </svg>

                {/* Animated Needle */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '20px', left: '50%',
                        width: '4px', height: '60px',
                        backgroundColor: 'white',
                        borderRadius: '2px',
                        transformOrigin: 'bottom center',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}
                    animate={{ rotateZ: rotation }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                />

                {/* Center Pivot Point */}
                <div style={{
                    position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
                    width: '16px', height: '16px',
                    backgroundColor: 'white', borderRadius: '50%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                }} />

                {/* Text Readout */}
                <div style={{
                    position: 'absolute', bottom: '-10px', width: '100%',
                    textAlign: 'center', display: 'flex', flexDirection: 'column'
                }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentData.label}</span>
                    <span style={{ fontSize: '0.8rem', color: currentData.color }}>Level {aqi}</span>
                </div>
            </div>
        </GlassCard>
    );
}
