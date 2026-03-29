import React from 'react';
import { motion } from 'framer-motion';

export default function DataPill({
    label,
    value,
    icon,
    delay = 0
}) {
    return (
        <motion.div
            className="data-pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
        >
            {icon && <span className="pill-icon">{icon}</span>}
            <span className="pill-label">{label}</span>
            <span className="pill-value">{value}</span>
        </motion.div>
    );
}
