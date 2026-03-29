import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Glassmorphic Card Container
 * Handles the 3D perspective hover effects, blur filters, and atmospheric lighting
 */
export default function GlassCard({
    children,
    className = '',
    style = {},
    variant = 'default', // 'default', 'subtle', 'highlight'
    hover3D = false
}) {

    const baseClasses = `glass-container variant-${variant} ${className}`;

    // Standard CSS-based glass module (no complicated JS 3D to save performance unless hover3D requested)
    if (!hover3D) {
        return (
            <div className={baseClasses} style={style}>
                {children}
            </div>
        );
    }

    // Framer Motion 3D Hover Effect
    return (
        <motion.div
            className={baseClasses}
            style={{
                ...style,
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 40px 0 rgba(0,0,0,0.3)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <div className="glass-content-wrapper">
                {children}
            </div>
        </motion.div>
    );
}
