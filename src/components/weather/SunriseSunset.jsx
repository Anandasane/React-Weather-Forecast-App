import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useThemeContext } from '../../context/ThemeContext';

export default function SunriseSunset({ sys, timezone }) {
    const { isDay, dayNightRatio } = useThemeContext();

    if (!sys || !sys.sunrise || !sys.sunset) return null;

    // Convert UNIX timestamps to local timezone strings
    const formatTime = (ts) => {
        const date = new Date((ts + timezone) * 1000); // Adjust for API timezone offset
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    };

    const sunriseStr = formatTime(sys.sunrise);
    const sunsetStr = formatTime(sys.sunset);

    // dayNightRatio is 0 at sunrise, 1 at sunset. Nighttime it's > 1 or < 0.
    // Clamp between 0 and 1 for the daytime arc. Focus on day arc primarily per spec.
    const progress = Math.min(Math.max(dayNightRatio, 0), 1);

    // SVG Path: M 20 80 (start) A 60 60 0 0 1 140 80 (end arc)
    // Radius is 60. Center is 80, 80.
    // Progress 0 = 180 degrees (left), Progress 1 = 0 degrees (right)
    const angle = 180 - (progress * 180);
    const rad = angle * (Math.PI / 180);
    const r = 60;
    const cx = 80;
    const cy = 80;

    // Calculate sun position on arc
    const sunX = cx + r * Math.cos(rad);
    const sunY = cy - r * Math.sin(rad);

    return (
        <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ alignSelf: 'flex-start', margin: '0 0 1rem 0' }}>Sun Trajectory</h3>

            <div style={{ position: 'relative', width: '160px', height: '100px', display: 'flex', justifyContent: 'center' }}>
                <svg width="160" height="90" viewBox="0 0 160 90">
                    <defs>
                        <linearGradient id="sun-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,154,158,0.8)" />
                            <stop offset="50%" stopColor="#fecbef" />
                            <stop offset="100%" stopColor="rgba(250,112,154,0.8)" />
                        </linearGradient>
                    </defs>

                    {/* Background Arc */}
                    <path
                        d="M 20 80 A 60 60 0 0 1 140 80"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />

                    {/* Progress Arc (Drawn up to current time) */}
                    {isDay && (
                        <path
                            d={`M 20 80 A 60 60 0 0 1 ${sunX} ${sunY}`}
                            fill="none"
                            stroke="url(#sun-arc-grad)"
                            strokeWidth="3"
                        />
                    )}

                    {/* Animated Sun / Moon Marker */}
                    <motion.circle
                        r="8"
                        fill={isDay ? "#ffeb3b" : "#e2e8f0"}
                        filter={isDay ? "drop-shadow(0 0 8px #ffeb3b)" : "drop-shadow(0 0 5px #ffffff)"}
                        initial={{ cx: 20, cy: 80 }}
                        animate={{ cx: sunX, cy: sunY }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                    />
                </svg>

                {/* Labels */}
                <div style={{ position: 'absolute', bottom: '0', left: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {sunriseStr}
                </div>
                <div style={{ position: 'absolute', bottom: '0', right: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {sunsetStr}
                </div>
            </div>
        </GlassCard>
    );
}
