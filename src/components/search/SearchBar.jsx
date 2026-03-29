import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCitySearch } from '../../hooks/useWeather';
import { useWeatherContext } from '../../context/WeatherContext';
import { useGeolocation } from '../../hooks/useGeolocation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Custom hook wrapping React Query for OWM geocoding
    const { data: suggestions, isFetching } = useCitySearch(query, isFocused && query.length > 2);
    const { selectLocation } = useWeatherContext();
    const { requestLocation, isLocating } = useGeolocation();

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [containerRef]);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [suggestions]);

    const handleSelect = (city) => {
        if (!city) return;
        selectLocation(city.lat, city.lon, city.name);
        setQuery('');
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleLocationClick = async () => {
        const coords = await requestLocation();
        if (coords) {
            selectLocation(coords.latitude, coords.longitude, "Current Location");
            setIsFocused(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!suggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0) {
                handleSelect(suggestions[selectedIndex]);
            } else if (suggestions.length > 0) {
                handleSelect(suggestions[0]);
            }
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div
            className="search-container floating-pill"
            ref={containerRef}
            style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
        >
            <motion.div
                className={`search-box ${isFocused ? 'focused' : ''}`}
                initial={false}
                animate={{ width: isFocused ? '480px' : '340px' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                    display: 'flex', alignItems: 'center', background: 'rgba(25, 30, 40, 0.4)',
                    backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '99px', padding: '0.75rem 1.25rem', gap: '0.75rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
            >
                <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>🔍</span>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', color: 'white',
                        fontFamily: 'var(--font-display)', fontSize: '1.1rem', outline: 'none'
                    }}
                />

                {query.length > 0 ? (
                    <button
                        onClick={() => setQuery('')}
                        style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                        &times;
                    </button>
                ) : (
                    <button
                        onClick={handleLocationClick}
                        title="Use Current Location"
                        style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: isLocating ? 0.5 : 0.8, transition: 'opacity 0.2s', padding: '0'
                        }}
                    >
                        {isLocating ? (
                            <div className="search-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                )}
            </motion.div>

            <AnimatePresence>
                {isFocused && query.length > 2 && suggestions && suggestions.length > 0 && (
                    <motion.div
                        className="search-dropdown glass-container"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 10 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                        style={{
                            position: 'absolute', top: '100%', left: 0, width: '100%', maxHeight: '400px',
                            overflowY: 'auto', borderRadius: '24px', padding: '0.5rem', transformOrigin: "top center"
                        }}
                    >
                        {suggestions.map((city, i) => (
                            <motion.div
                                key={`${city.lat}-${city.lon}-${i}`}
                                className="suggestion-item"
                                onClick={() => handleSelect(city)}
                                onMouseEnter={() => setSelectedIndex(i)}
                                style={{
                                    padding: '1rem', borderRadius: '16px', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: selectedIndex === i ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{city.name}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                        {city.state ? `${city.state}, ` : ''}{city.country}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>
                                    {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
