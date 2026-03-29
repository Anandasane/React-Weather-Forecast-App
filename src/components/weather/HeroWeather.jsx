import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import WeatherIcon3D from './WeatherIcon3D';

export default function HeroWeather({ weather, locationName, isDay, onToggleUnits }) {
    const cardRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

    // Glass Reflection
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate relative mouse position (-0.5 to 0.5)
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / rect.width - 0.5);
        y.set(mouseY / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Live Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!weather) return null;

    const current = weather.main;
    const condition = weather.weather[0];

    return (
        <motion.div
            ref={cardRef}
            className="hero-weather-card glass-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
                perspective: '1000px',
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Dynamic Glare Reflection Overlay */}
            <motion.div
                className="glare-reflection"
                style={{
                    position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 40%)',
                    left: glareX, top: glareY, transform: 'translate(-50%, -50%)',
                    width: '200%', height: '200%'
                }}
            />

            <div className="hero-content" style={{ transform: 'translateZ(30px)' }}>
                <div className="hero-header">
                    <h2>{locationName}</h2>
                    <p className="local-time">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className="hero-center">
                    <motion.div
                        className="hero-icon-wrapper"
                        style={{ transform: 'translateZ(60px)' }}
                        whileHover={{ translateZ: '80px', scale: 1.05 }}
                    >
                        <WeatherIcon3D conditionId={condition.id} isDay={isDay} />
                    </motion.div>

                    <div className="temp-interactive" onClick={onToggleUnits} title="Click to toggle units">
                        <span className="temp-number">
                            {Math.round(current.temp)}
                        </span>
                        <span className="degree-symbol">&deg;</span>
                    </div>
                </div>

                <div className="hero-footer">
                    <p className="hero-condition">{condition.description}</p>
                    <div className="hero-high-low">
                        <span>H: {Math.round(current.temp_max)}&deg;</span>
                        <span>L: {Math.round(current.temp_min)}&deg;</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
