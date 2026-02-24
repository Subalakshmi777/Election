import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isRejection = message.text === "Sorry, I am trained only for election related queries.";

    const variants = {
        hidden: {
            opacity: 0,
            x: isUser ? 50 : -50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate={isRejection ? ["visible", "shake"] : "visible"}
            className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white shadow-lg z-10 ${isUser ? 'bg-gov-saffron ml-4' : 'bg-navy mr-4'
                        }`}
                >
                    {isUser ? <User size={24} className="text-white" /> : <Bot size={24} className="text-white" />}
                </motion.div>

                <div
                    className={`relative px-7 py-5 shadow-sm border-2 ${isUser
                        ? 'bg-gradient-to-br from-gov-saffron to-gov-gold text-white border-gov-gold rounded-[24px] rounded-tr-none'
                        : 'bg-white text-navy-dark border-navy-dark/10 rounded-[24px] rounded-tl-none'
                        }`}
                >
                    <div className="text-sm font-bold leading-relaxed tracking-tight font-serif italic">
                        {isUser ? "Public Query:" : "Official Response:"}
                    </div>
                    <div className="text-base font-semibold leading-relaxed mt-1">
                        {message.text}
                    </div>
                    <div className={`text-[9px] mt-3 font-black uppercase tracking-widest opacity-40 ${isUser ? 'text-right' : 'text-left'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {!isUser && (
                        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
                            <Bot size={40} className="text-navy" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
