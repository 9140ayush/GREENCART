import React, { useState, useEffect } from 'react';
import './chatbot.css';
import ChatbotUI from './ChatbotUI';
import { detectIntent, getLocalResponse, SYSTEM_PROMPT } from '../../services/chatbotService';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Chatbot = () => {
    const { products } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm GreenCart AI. How can I help you today? 🍏", sender: 'bot' }
    ]);
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

    // Theme detection for dynamic styling
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Persist chat history
    useEffect(() => {
        console.log("Chatbot Functional & API Connected!");
        const savedChat = localStorage.getItem('greencart_chat');
        if (savedChat) {
            setMessages(JSON.parse(savedChat));
        }

        const savedHistory = localStorage.getItem('greencart_chat_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('greencart_chat', JSON.stringify(messages));
        localStorage.setItem('greencart_chat_history', JSON.stringify(history));
    }, [messages, history]);

    const handleSendMessage = async (customMessage) => {
        const messageText = typeof customMessage === 'string' ? customMessage : inputValue;
        if (!messageText || !messageText.trim()) return;

        const userMessage = { text: messageText.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        // Only clear input if we were sending standard text, not button clicks
        if (typeof customMessage !== 'string') {
            setInputValue("");
        }
        
        setIsTyping(true);

        const newHistory = [...history, { role: "user", content: messageText.trim() }];
        setHistory(newHistory);

        // Smart Intent Detection (Local Overrides)
        const intent = detectIntent(messageText);
        if (intent !== "ai") {
            const localReply = getLocalResponse(intent, messageText, products);
            if (localReply) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { ...localReply, sender: 'bot' }]);
                    setHistory(prev => [...prev, { role: "assistant", content: localReply.text }]);
                    setIsTyping(false);
                }, 600);
                return;
            }
        }

        // External API Call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
            
            if (!apiKey) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: "API Key missing! Please add VITE_ANTHROPIC_API_KEY to your .env file 🔑", sender: 'bot' }]);
                    setIsTyping(false);
                }, 1000);
                clearTimeout(timeoutId);
                return;
            }

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: "claude-haiku-20240307",
                    max_tokens: 400,
                    system: SYSTEM_PROMPT,
                    messages: newHistory
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("API_ERROR");

            const data = await response.json();
            const reply = data.content[0].text;
            
            setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
            setHistory(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                setMessages(prev => [...prev, { text: "Sorry, I'm a bit slow right now! 🌿 Please try again.", sender: 'bot' }]);
            } else if (error.message === "API_ERROR") {
                setMessages(prev => [...prev, { text: "I'm taking a quick break 🌱 Try again in a moment!", sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { text: "Connection issue! Check your internet 📶", sender: 'bot' }]);
            }
        } finally {
            setIsTyping(false);
        }
    };

    // 3D rotation logic for the button
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        if (isOpen) return;
        const btn = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - btn.left - btn.width / 2;
        const y = e.clientY - btn.top - btn.height / 2;
        setRotate({ x: -y / 5, y: x / 5 });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div className={`chatbot-container ${isDark ? 'dark' : 'light'}`}>
            <ChatbotUI 
                messages={messages} 
                isOpen={isOpen} 
                onSendMessage={handleSendMessage}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isTyping={isTyping}
                isDark={isDark}
            />

            <motion.button
                className={`chatbot-button ${!isOpen ? 'pulse-animation' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                    scale: isOpen ? 0.9 : 1
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Chat with AI"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
