import React from 'react';
import { motion } from 'framer-motion';

export default function Starfield() {
    const stars = React.useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // vw
        y: Math.random() * 100, // vh
        size: Math.random() * 2 + 1, // 1px to 3px
        duration: Math.random() * 3 + 2, // twinkle speed
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3
    })), []);

    return (
        <div className="particle-layer starfield">
            {/* Milky way diagonal gradient overlay */}
            <div className="milky-way" style={{
                position: 'absolute',
                top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 50%)',
                transform: 'rotate(25deg)'
            }}></div>

            {/* Moon glow */}
            <div className="moon-glow" style={{
                position: 'absolute', top: '15%', right: '15%',
                width: '100px', height: '100px', borderRadius: '50%',
                boxShadow: '0 0 60px 20px rgba(255,255,255,0.2), inset -10px -10px 20px rgba(0,0,0,0.5)',
                background: '#fcfccc'
            }}></div>

            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="star"
                    style={{
                        position: 'absolute',
                        left: `${star.x}vw`,
                        top: `${star.y}vh`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 0 4px rgba(255,255,255,0.8)'
                    }}
                    initial={{ opacity: star.opacity }}
                    animate={{
                        opacity: [star.opacity, star.opacity * 0.2, star.opacity]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
