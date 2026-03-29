import React from 'react';
import { motion } from 'framer-motion';

export default function TornadoVortex() {
    const rings = React.useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        width: Math.max(10, 100 - i * 4), // Cone shape getting smaller
        height: 10,
        yOffset: i * 8, // Stacking down
        delay: i * 0.1
    })), []);

    const debris = React.useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        startX: Math.random() * 100 - 50,
        endX: Math.random() * -100 + 50,
        startY: Math.random() * 200 - 100,
        endY: Math.random() * -200 + 100,
        duration: Math.random() * 1 + 0.5
    })), []);

    return (
        <div className="particle-layer tornado-layer" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="vortex-container" style={{ position: 'relative', width: '20vh', height: '60vh' }}>
                {rings.map((ring) => (
                    <motion.div
                        key={ring.id}
                        className="vortex-ring"
                        style={{
                            position: 'absolute',
                            top: `${ring.yOffset}%`,
                            left: '50%',
                            width: `${ring.width}%`,
                            height: `${ring.height}%`,
                            backgroundColor: 'rgba(50, 60, 50, 0.4)',
                            borderRadius: '50%',
                            filter: 'blur(4px)',
                            transformOrigin: 'center center'
                        }}
                        animate={{
                            x: ['-50%', '-60%', '-40%', '-50%'],
                            rotateZ: [0, 360],
                            scaleX: [1, 0.9, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: ring.delay,
                            ease: "linear"
                        }}
                    />
                ))}
                {/* Debris particles */}
                {debris.map((deb) => (
                    <motion.div
                        key={`deb-${deb.id}`}
                        className="debris"
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '4px', height: '4px', background: '#222',
                            borderRadius: '50%'
                        }}
                        animate={{
                            rotateZ: [0, 360],
                            x: [deb.startX, deb.endX],
                            y: [deb.startY, deb.endY]
                        }}
                        transition={{ duration: deb.duration, repeat: Infinity, ease: "linear" }}
                    />
                ))}
            </div>
        </div>
    );
}
