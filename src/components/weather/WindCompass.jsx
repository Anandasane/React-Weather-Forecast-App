import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function WindCompass({ speed, deg, unit = 'km/h' }) {
    // Beaufort scale color mapping
    const getWindColor = (spd) => {
        // Assumes km/h for this basic scaling
        if (spd < 20) return '#22c55e'; // Green
        if (spd < 40) return '#facc15'; // Yellow
        if (spd < 60) return '#f97316'; // Orange
        return '#ef4444'; // Red
    };

    const windColor = getWindColor(speed);

    return (
        <GlassCard className="wind-compass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ alignSelf: 'flex-start', margin: '0 0 1rem 0' }}>Wind</h3>

            <div
                className="compass-container"
                style={{
                    position: 'relative',
                    width: '140px', height: '140px',
                    perspective: '800px'
                }}
            >
                {/* 3D Tilted Compass Face */}
                <motion.div
                    style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.2)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        rotateX: '45deg', // Creates the 3D oval illusion
                        transformStyle: 'preserve-3d',
                        boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5), 0 10px 15px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Tick marks */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: 0, left: '50%', width: i % 3 === 0 ? '4px' : '2px',
                            height: i % 3 === 0 ? '10px' : '6px', backgroundColor: 'rgba(255,255,255,0.3)',
                            transformOrigin: '50% 70px',
                            transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }} />
                    ))}

                    {/* Cardinal Points */}
                    <span style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', fontWeight: 'bold' }}>N</span>
                    <span style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', fontWeight: 'bold' }}>S</span>
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 'bold' }}>E</span>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 'bold' }}>W</span>

                    {/* Animated Rotating Needle */}
                    <motion.div
                        className="compass-needle"
                        style={{
                            position: 'absolute', top: '15px', left: '50%',
                            width: '4px', height: '110px',
                            transformOrigin: 'center center'
                        }}
                        initial={{ rotateZ: 0 }}
                        animate={{ rotateZ: deg }} // The OpenWeatherMap wind bearing
                        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    >
                        {/* Needle head (North pointing) */}
                        <div style={{
                            width: '0', height: '0',
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderBottom: `25px solid ${windColor}`,
                            position: 'absolute', left: '-4px', top: 0
                        }} />
                        {/* Needle tail */}
                        <div style={{
                            width: '4px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)',
                            position: 'absolute', bottom: 0, left: '0'
                        }} />
                    </motion.div>
                </motion.div>

                {/* Central Speed Readout (Flat, not 3D tilted, overlays top) */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateZ(40px)',
                    width: '60px', height: '60px',
                    background: 'rgba(20, 20, 30, 0.8)',
                    borderRadius: '50%', backdropFilter: 'blur(4px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    border: `2px solid ${windColor}`,
                    boxShadow: `0 0 15px ${windColor}66`
                }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>{Math.round(speed)}</span>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>{unit}</span>
                </div>
            </div>
        </GlassCard>
    );
}
