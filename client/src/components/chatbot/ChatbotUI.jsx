import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const ChatbotUI = ({ messages, isOpen, onSendMessage, inputValue, setInputValue, isTyping, isDark }) => {
    const { currency } = useAppContext();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage();
    };

    const quickChips = ["🥦 Fresh Vegetables", "🍎 Fruits", "🛒 View Cart", "🚚 Delivery Info", "💰 Today's Deals"];
    const showChips = messages.length === 1 && messages[0].sender === 'bot';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`chatbot-window ${isDark ? 'dark' : ''}`}
                >
                    <div className={`chatbot-header ${isDark ? 'dark' : ''}`}>
                        <div className="chatbot-header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                            </svg>
                            GreenCart AI
                        </div>
                    </div>

                    <div className={`chatbot-messages ${isDark ? 'dark' : ''}`}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-bot'} ${isDark ? 'dark' : ''}`}
                            >
                                {msg.text}
                                
                                {msg.products && (
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {msg.products.map((product, pIndex) => (
                                            <div key={pIndex} className={`bot-product-card ${isDark ? 'dark' : ''}`}>
                                                <img src={product.image[0]} alt={product.name} className="bot-product-img" />
                                                <div className="bot-product-info">
                                                    <div className={`bot-product-name truncate ${isDark ? 'dark' : ''}`}>{product.name}</div>
                                                    <div className={`bot-product-price ${isDark ? 'dark' : ''}`}>{currency}{product.offerPrice}</div>
                                                    <button 
                                                        onClick={() => window.location.href = `/products?search=${product.name}`}
                                                        className={`bot-product-search-btn ${isDark ? 'dark' : ''}`}
                                                    >
                                                        Add to Search →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        
                        {showChips && !isTyping && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="chatbot-quick-chips"
                            >
                                {quickChips.map((chip, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => onSendMessage(chip)} 
                                        className={`chatbot-quick-chip ${isDark ? 'dark' : ''}`}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {isTyping && (
                            <div className={`message-bubble message-bot ${isDark ? 'dark' : ''}`}>
                                <div className="typing-dots">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className={`chatbot-input-container ${isDark ? 'dark' : ''}`}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className={`chatbot-input ${isDark ? 'dark' : ''}`}
                            disabled={isTyping}
                            maxLength={300}
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim() || isTyping} 
                            className={`chatbot-send-btn ${isDark ? 'dark' : ''}`}
                        >
                            {isTyping ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            )}
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatbotUI;
