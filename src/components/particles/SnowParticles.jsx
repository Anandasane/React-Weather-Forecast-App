import React from 'react';

export default function SnowParticles() {
    // Generate exactly 60 depth-layered flakes
    const flakes = React.useMemo(() => Array.from({ length: 60 }).map((_, i) => {
        const size = Math.random() * 8 + 4; // 4px to 12px
        const isSmall = size < 6;

        return {
            id: i,
            size,
            opacity: Math.random() * 0.4 + 0.5, // 0.5 to 0.9
            left: Math.random() * 100, // 0 to 100 vw
            duration: Math.random() * 6 + 4, // 4s to 10s
            delay: Math.random() * -10, // Negative delay to start mid-animation
            blur: isSmall ? 'blur(1px)' : 'none',
            translateX: Math.random() * 200 - 100 // -100px to 100px drift
        };
    }), []);

    return (
        <div className="particle-layer snow-layer" style={{ pointerEvents: 'none', zIndex: 1 }}>
            {flakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        position: 'fixed',
                        top: '-20px',
                        left: `${flake.left}vw`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        borderRadius: '50%',
                        background: `rgba(255, 255, 255, ${flake.opacity})`,
                        filter: flake.blur,
                        // Custom CSS property used by the @keyframes to drift dynamically
                        '--snow-drift': `${flake.translateX}px`,
                        animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`
                    }}
                />
            ))}
        </div>
    );
}
