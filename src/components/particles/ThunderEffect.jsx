import React from 'react';
import { motion } from 'framer-motion';

export default function ThunderEffect() {
    return (
        <motion.div
            className="thunder-flash"
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, 0, 0.8, 0.2, 1, 0, 0]
            }}
            transition={{
                duration: 8, // Flash every ~8 seconds
                repeat: Infinity,
                times: [0, 0.9, 0.92, 0.94, 0.96, 0.98, 1], // Timing of the double-flash
                ease: "linear"
            }}
        />
    );
}
