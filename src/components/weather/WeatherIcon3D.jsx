import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherIcon3D({ conditionId, isDay }) {

    const renderSun = () => (
        <div className="icon-wrapper">
            <motion.div
                className="sun-core"
                style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffe57f 0%, #ff8f00 100%)',
                    boxShadow: '0 0 40px #ffb300',
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', zIndex: 2
                }}
            />
            <motion.div
                className="sun-rays"
                style={{
                    width: '120px', height: '120px', position: 'absolute',
                    top: '50%', left: '50%', x: '-50%', y: '-50%', zIndex: 1
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: '4px', height: '100%',
                        background: 'linear-gradient(to bottom, #ffc107 15%, transparent 15%, transparent 85%, #ffc107 85%)',
                        left: '50%', transform: `translateX(-50%) rotate(${deg}deg)`,
                        borderRadius: '2px'
                    }} />
                ))}
            </motion.div>
        </div>
    );

    const renderCloud = () => (
        <motion.div
            className="cloud-core"
            style={{
                width: '120px', height: '40px', background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
                borderRadius: '40px', position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -10%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 -4px 6px rgba(0,0,0,0.05)'
            }}
            animate={{ y: ['-10%', '-20%', '-10%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            <div style={{
                position: 'absolute', width: '50px', height: '50px',
                background: '#ffffff', borderRadius: '50%', top: '-25px', left: '20px'
            }} />
            <div style={{
                position: 'absolute', width: '70px', height: '70px',
                background: '#ffffff', borderRadius: '50%', top: '-40px', right: '15px'
            }} />
        </motion.div>
    );

    const renderRain = () => (
        <div className="icon-wrapper">
            {renderCloud()}
            <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div key={i} style={{
                        width: '4px', height: '15px', background: '#4facfe', borderRadius: '2px'
                    }}
                        animate={{ y: [0, 20], opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay, ease: "linear" }}
                    />
                ))}
            </div>
        </div>
    );

    const renderSnow = () => (
        <div className="icon-wrapper">
            {renderCloud()}
            <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
                {[0, 1.5, 3].map((delay, i) => (
                    <motion.div key={i} style={{
                        color: 'white', fontSize: '18px', lineHeight: 1, textShadow: '0 0 5px rgba(255,255,255,0.8)'
                    }}
                        animate={{ y: [0, 25], x: [0, i % 2 === 0 ? 5 : -5, 0], opacity: [1, 0], rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, delay, ease: "linear" }}
                    >
                        ❄
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderThunder = () => (
        <div className="icon-wrapper">
            {renderCloud()}
            <motion.svg
                width="40" height="60" viewBox="0 0 24 24"
                style={{ position: 'absolute', top: '50%', left: '50%', x: '-50%', filter: 'drop-shadow(0 0 10px #fdd835)' }}
                animate={{ opacity: [1, 0, 1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
            >
                <path d="M11 21l-1-7H5l10-12v7h5l-9 12z" fill="#fdd835" />
            </motion.svg>
        </div>
    );

    const renderMoon = () => (
        <div className="icon-wrapper">
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '70px', height: '70px', borderRadius: '50%',
                boxShadow: 'inset -15px -10px 0 0 #fffbea',
                filter: 'drop-shadow(0 0 15px rgba(255, 251, 234, 0.4))'
            }} />
            {[
                { top: '10%', left: '20%', delay: 0 },
                { top: '20%', right: '10%', delay: 0.5 },
                { top: '80%', left: '30%', delay: 1 }
            ].map((star, i) => (
                <motion.div key={i} style={{
                    position: 'absolute', top: star.top, left: star.left, right: star.right,
                    width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%',
                    boxShadow: '0 0 8px white'
                }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: star.delay }}
                />
            ))}
        </div>
    );

    const getIconContent = () => {
        if (conditionId >= 200 && conditionId <= 232) return renderThunder();
        if ((conditionId >= 300 && conditionId <= 321) || (conditionId >= 500 && conditionId <= 531)) return renderRain();
        if (conditionId >= 600 && conditionId <= 622) return renderSnow();
        if (conditionId >= 701 && conditionId <= 771) return renderCloud(); // Default to cloud for atmoshpere for now
        if (conditionId === 781) return renderCloud(); // Tornado fallback
        if (conditionId === 800) return isDay ? renderSun() : renderMoon();
        return renderCloud(); // 801-804
    };

    return (
        <div
            className="weather-icon-3d-container"
            style={{
                position: 'relative', width: '160px', height: '160px',
                transformStyle: 'preserve-3d', transform: 'translateZ(40px)'
            }}
        >
            {getIconContent()}
        </div>
    );
}
