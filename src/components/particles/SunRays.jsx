import React from 'react';
import { motion } from 'framer-motion';

export default function SunRays() {
    const rays = React.useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        rotate: (360 / 8) * i,
        duration: Math.random() * 10 + 20, // Slow rotation
        opacity: Math.random() * 0.15 + 0.05
    })), []);

    return (
        <div className="particle-layer sun-rays-layer" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
        }}>
            {/* Central Sun Corona Effect */}
            <motion.div
                className="sun-corona"
                style={{
                    position: 'absolute',
                    width: '30vh', height: '30vh',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,200,100,0.2) 40%, transparent 70%)',
                    borderRadius: '50%'
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Rotating Crepuscular Rays */}
            <motion.div
                className="rays-container"
                style={{ position: 'absolute', width: '200vw', height: '200vw', transformOrigin: 'center' }}
                animate={{ rotateZ: [0, 360] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                {rays.map((ray) => (
                    <div
                        key={ray.id}
                        className="sun-ray"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '100%', height: '5vh',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
                            transformOrigin: '0 50%',
                            transform: `rotate(${ray.rotate}deg)`,
                            opacity: ray.opacity
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}
