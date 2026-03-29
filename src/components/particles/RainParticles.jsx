import React, { useEffect, useRef } from 'react';
import { useWeatherContext } from '../../context/WeatherContext';

export default function RainParticles() {
    const canvasRef = useRef(null);
    const { currentWeather } = useWeatherContext();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !currentWeather) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize canvas to window dimensions
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Interpret Weather ID for Rain Intensity
        const conditionId = currentWeather.weather[0].id;
        let numDrops = 150; // Default light rain
        let minSpeed = 12;
        let maxSpeed = 20;
        let minLength = 15;
        let maxLength = 30;

        if (conditionId >= 300 && conditionId <= 321) {
            // Drizzle
            numDrops = 80;
            minSpeed = 8; maxSpeed = 15;
            minLength = 10; maxLength = 20;
        } else if (conditionId === 500 || conditionId === 501) {
            // Light Rain
            numDrops = 150;
        } else if (conditionId === 502 || conditionId === 503 || conditionId === 504) {
            // Moderate Rain
            numDrops = 250;
            minSpeed = 18; maxSpeed = 28;
        } else if (conditionId === 511 || (conditionId >= 521 && conditionId <= 531) || (conditionId >= 200 && conditionId < 300)) {
            // Heavy Rain or Thunderstorm
            numDrops = 400;
            minSpeed = 25; maxSpeed = 40;
            minLength = 20; maxLength = 45;
        }

        const windSpeed = currentWeather.wind ? currentWeather.wind.speed : 0;
        const windDeg = currentWeather.wind ? currentWeather.wind.deg : 0;

        // Base angle modifier derived from wind direction
        // Assume wind from left (blows right) or right (blows left)
        const windDirectionModifier = (windDeg > 180) ? -1 : 1;

        const createDrop = () => {
            const drop = {};

            drop.reset = (randomizeY = false) => {
                drop.x = Math.random() * canvas.width;
                drop.y = randomizeY ? (Math.random() * canvas.height) - canvas.height : -100;
                drop.length = minLength + Math.random() * (maxLength - minLength);
                drop.baseSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
                drop.speed = drop.baseSpeed + (windSpeed * 0.3);
                drop.opacity = 0.3 + Math.random() * 0.4; 
                const degAngle = 15 + (windDirectionModifier * (5 + Math.random() * 20));
                drop.angle = degAngle * (Math.PI / 180);
            };

            drop.update = () => {
                drop.y += drop.speed;
                drop.x += Math.sin(drop.angle) * drop.speed * 0.3;

                if (drop.y > canvas.height + drop.length) {
                    drop.reset();
                }

                if (drop.x > canvas.width + 100) drop.x = -50;
                else if (drop.x < -100) drop.x = canvas.width + 50;
            };

            drop.draw = () => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                const endX = drop.x + Math.sin(drop.angle) * drop.length;
                const endY = drop.y + Math.cos(drop.angle) * drop.length;
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(174, 214, 241, ${drop.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            };

            drop.reset(true);
            return drop;
        };

        const drops = Array.from({ length: numDrops }).map(() => createDrop());

        const render = () => {
            // Clear entire canvas frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drops.forEach(drop => {
                drop.update();
                drop.draw();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentWeather]);

    return (
        <canvas
            ref={canvasRef}
            className="particle-layer rain-layer"
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
        />
    );
}
