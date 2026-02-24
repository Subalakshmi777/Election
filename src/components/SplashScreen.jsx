import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Vote } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Background Patterns */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 flex flex-wrap"
            >
                {Array.from({ length: 20 }).map((_, i) => (
                    <Vote key={i} size={80} className="m-8 text-navy" />
                ))}
            </motion.div>

            {/* Logo Section */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="relative">
                    {/* Pulsing Sound Wave Effect */}
                    {[1, 2, 3].map((ring) => (
                        <motion.div
                            key={ring}
                            className="absolute inset-0 rounded-full border-2 border-gov-saffron/30"
                            animate={{
                                scale: [1, 2.5],
                                opacity: [0.5, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2.5,
                                delay: ring * 0.8,
                                ease: "easeOut",
                            }}
                        />
                    ))}

                    <div className="w-32 h-32 rounded-full border-4 border-gov-saffron flex items-center justify-center bg-white shadow-2xl relative z-10">
                        <div className="flex flex-col items-center">
                            <Vote size={48} className="text-navy mb-1" />
                            <div className="w-12 h-1 bg-gov-green rounded-full" />
                        </div>
                    </div>

                    <motion.div
                        className="absolute -top-2 -right-2 bg-gov-saffron p-2 rounded-full border-2 border-white shadow-lg z-20"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Mic size={20} className="text-white" />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-8 text-5xl font-black text-navy font-serif tracking-tight uppercase"
                >
                    Vote<span className="text-gov-saffron">Sense</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-3 text-lg text-navy/40 font-medium italic font-serif"
                >
                    "Official Election Assistant"
                </motion.p>

                {/* Animated Bouncing Loading Dots */}
                <div className="flex space-x-2 mt-10">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-gov-saffron rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Tricolor Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                <div className="flex-1 bg-saffron" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-green" />
            </div>

            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-2 left-0 right-0 h-1 bg-navy origin-left"
            />
        </div>
    );
};

export default SplashScreen;
