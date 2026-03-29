import React from 'react';
import { motion } from 'framer-motion';

export default function CloudDrift({ density = 'few' }) // few, scattered, broken, overcast
{
    const cloudCount = density === 'few' ? 2 : density === 'scattered' ? 4 : density === 'broken' ? 6 : 8;

    const clouds = React.useMemo(() => Array.from({ length: cloudCount }).map((_, i) => ({
        id: i,
        y: Math.random() * 40, // Top 40% of screen
        duration: Math.random() * 100 + 100, // Very slow drift
        delay: Math.random() * -100, // Start half-way across screen
        scale: Math.random() * 1 + 1,
        opacity: density === 'overcast' ? 0.7 : Math.random() * 0.3 + 0.1,
        zIndex: Math.floor(Math.random() * 3)
    })), [cloudCount, density]);

    return (
        <div className="particle-layer cloud-layer">
            {clouds.map((cloud) => (
                <motion.div
                    key={cloud.id}
                    className="parallax-cloud"
                    style={{
                        top: `${cloud.y}vh`,
                        transform: `scale(${cloud.scale})`,
                        opacity: cloud.opacity,
                        zIndex: cloud.zIndex
                    }}
                    animate={{ x: ['-20vw', '120vw'] }}
                    transition={{
                        duration: cloud.duration,
                        repeat: Infinity,
                        delay: cloud.delay,
                        ease: "linear"
                    }}
                >
                    {/* SVG cloud shapes generally applied via CSS background-image for simplicity, or complex SVG child here */}
                    <div className="cloud-blob"></div>
                </motion.div>
            ))}

            {density === 'overcast' && <div className="overcast-overlay"></div>}
        </div>
    );
}
