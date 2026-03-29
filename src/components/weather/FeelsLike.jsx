import React from 'react';
import GlassCard from '../ui/GlassCard';
import DataPill from '../ui/DataPill';

export default function FeelsLike({ feelsLike, humidity, uvi }) {
    return (
        <GlassCard className="feels-like-card" variant="subtle" hover3D={true}>
            <div className="feels-row">
                <div className="feels-main">
                    <span className="feels-label">Feels Like</span>
                    <span className="feels-value">{Math.round(feelsLike)}&deg;</span>
                </div>

                <div className="feels-metrics">
                    <DataPill
                        icon="💧"
                        label="Humidity"
                        value={`${humidity}%`}
                        delay={0.1}
                    />
                    {uvi !== undefined && (
                        <DataPill
                            icon="☀️"
                            label="UV Index"
                            value={Math.round(uvi)}
                            delay={0.2}
                        />
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
