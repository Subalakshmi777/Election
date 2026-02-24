import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, MoreVertical, Trash2, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import MessageBubble from './MessageBubble';
import partiesData from '../data/parties.json';
import { generateResponse } from '../utils/nlpEngine';
import { useSpeechRecognition, useSpeechSynthesis } from '../hooks/useSpeech';

const staticSuggestions = [
    "Which party has lotus symbol",
    "two leaves belongs to which party",
    "Who is CM candidate of BJP",
    "Tell me about TVK"
];

const ChatInterface = () => {
    // Generate dynamic suggestions from parties data
    const dynamicSuggestions = React.useMemo(() => {
        const names = partiesData.parties.map(p => p.name);
        const shorts = partiesData.parties.map(p => p.shortName);
        const symbols = partiesData.parties.map(p => p.symbol);
        const all = [...new Set([...names, ...shorts, ...symbols, ...staticSuggestions])];
        return all;
    }, []);

    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to VoteSense. I can help with election queries regarding parties, symbols, slogans and candidates. How can I assist you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [autocomplete, setAutocomplete] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasSupport } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();

    // Auto-trigger voice assistant on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            startListening();
        }, 500);
        return () => clearTimeout(timer);
    }, [startListening]);

    // Fuzzy Search for Autocomplete
    const fuse = React.useMemo(() => new Fuse(dynamicSuggestions, { threshold: 0.3 }), [dynamicSuggestions]);
    // ... existing useEffects for inputValue and transcript ...
    useEffect(() => {
        if (inputValue.length > 0) {
            const results = fuse.search(inputValue).map(r => r.item).slice(0, 5);
            setAutocomplete(results);
        } else {
            setAutocomplete([]);
        }
    }, [inputValue, fuse]);

    useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = (text = inputValue) => {
        const finalMsg = text.trim();
        if (!finalMsg) return;

        const userMsg = { id: Date.now(), text: finalMsg, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setAutocomplete([]);
        resetTranscript(); // Clear voice data
        setIsTyping(true);

        // Simulate bot thinking with 800ms delay
        setTimeout(() => {
            const responseText = generateResponse(finalMsg);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot', timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
            speak(responseText);
        }, 800);
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
            if (inputValue) handleSend(inputValue);
        } else {
            startListening();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-[75vh] w-full max-w-4xl bg-white glass-premium rounded-[40px] shadow-[0_20px_50px_rgba(0,0,128,0.15)] relative overflow-hidden ring-1 ring-navy/10"
        >
            {/* Header: Official Banner Style */}
            <header className="flex items-center justify-between px-10 py-5 bg-navy-dark text-white border-b-4 border-gov-saffron relative z-10 shadow-lg">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                        <div className="w-full h-full border-2 border-navy rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gov-saffron/20 via-transparent to-gov-green/20" />
                            <div className="w-6 h-6 bg-navy rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10 font-serif">
                                EC
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight font-serif uppercase">VOTE SENSE</h1>
                        <p className="text-[10px] font-bold text-gov-saffron tracking-[0.2em] uppercase">Election Commission Assistant</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Government of India</span>
                        <span className="text-[10px] font-black text-gov-gold uppercase tracking-tighter">OFFICIAL PORTAL</span>
                    </div>
                    <MoreVertical size={20} className="opacity-50" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-10 py-8 no-scrollbar bg-white/40 shadow-inner">
                <div className="space-y-6">
                    {/* Welcome Card Animation */}
                    <AnimatePresence>
                        {messages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                {messages.map((msg) => (
                                    <MessageBubble key={msg.id} message={msg} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isTyping && (
                        <div className="flex justify-start">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-[25px] rounded-bl-none border border-navy/10 flex space-x-2 items-center shadow-sm"
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.6,
                                            delay: i * 0.15
                                        }}
                                        className="w-2 h-2 bg-navy/40 rounded-full"
                                    />
                                ))}
                            </motion.div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </main>

            {/* Input Section */}
            <footer className="p-4 bg-transparent relative">
                {/* Autocomplete (Keyboard Style) */}
                <AnimatePresence>
                    {autocomplete.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 right-0 p-3 bg-white/60 backdrop-blur-xl border-t border-white/20 flex overflow-x-auto no-scrollbar space-x-3 pb-4"
                        >
                            {autocomplete.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(item)}
                                    className="whitespace-nowrap px-6 py-2.5 bg-white/50 border border-white/30 hover:bg-saffron hover:text-white text-navy text-sm font-bold rounded-2xl transition-all shadow-sm shrink-0 active:scale-95"
                                >
                                    {item}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Suggestion Chips */}
                {!inputValue && messages.length < 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mb-4"
                    >
                        {staticSuggestions.slice(0, 3).map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ y: -3, backgroundColor: "var(--color-navy)", color: "white" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSend(item)}
                                className="px-5 py-2.5 bg-white/40 border border-white/20 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 text-navy shrink-0"
                            >
                                {item}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <AnimatePresence>
                            {isListening && (
                                <motion.div
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute inset-0 bg-red-500 rounded-2xl z-0"
                                />
                            )}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMic}
                            className={`p-4 rounded-2xl transition-all relative z-10 shadow-lg ${isListening
                                ? 'bg-red-600 shadow-red-500/40 ring-4 ring-red-500/20'
                                : 'bg-gov-saffron shadow-gov-saffron/20'
                                }`}
                        >
                            <Mic size={22} className="text-white" />
                        </motion.button>
                    </div>

                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening to query..." : "Ask about Elections..."}
                            className="w-full px-6 py-4 bg-white/90 border-2 border-navy/10 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-navy/5 text-navy text-sm font-bold placeholder:text-navy/30 transition-all shadow-sm"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                        className="p-4 bg-gov-green rounded-2xl text-white shadow-[0_10px_30px_rgba(0,100,0,0.15)] disabled:opacity-30 disabled:grayscale transition-all"
                    >
                        <Send size={22} />
                    </motion.button>
                </div>
            </footer>

            {/* Tricolor Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex shadow-2xl">
                <div className="flex-1 bg-saffron shadow-[0_0_15px_rgba(255,153,51,0.8)]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-green shadow-[0_0_15px_rgba(19,136,8,0.8)]" />
            </div>
        </motion.div>
    );
};

export default ChatInterface;
