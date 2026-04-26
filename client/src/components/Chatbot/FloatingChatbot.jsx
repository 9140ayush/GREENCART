import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const SESSION_ID_KEY = 'greencart_chat_session';

const SUGGESTED_PROMPTS = [
  "What's on sale today?",
  "Suggest a healthy breakfast",
  "Track my latest order",
  "Do you have organic vegetables?",
  "What's your return policy?",
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm GreenBot 🌿 Your personal grocery assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  const getSessionId = () => {
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chat', {
        message: text,
        sessionId: getSessionId(),
        context: { page: location.pathname },
      });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Sorry, I had trouble connecting. Please try again in a moment!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with GreenBot"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: isOpen ? '#6B6B60' : '#3BB77E',
          border: '2px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(59, 183, 126,0.40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
          fontSize: isOpen ? '20px' : '24px',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '🌿'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 9998,
          width: '380px',
          height: '560px',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          border: '1px solid var(--border-main)',
          animation: 'chatSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #3BB77E, #29A56C)',
            color: '#fff',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>🌿</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-display)' }}>GreenBot</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>Powered by Gemini AI · Usually instant</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', animation: 'badgePulse 2s infinite' }} />
                <span style={{ fontSize: '11px', opacity: 0.8 }}>Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }} className="no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: msg.role === 'user' ? '#3BB77E' : 'var(--bg-surface-2, var(--border-soft))',
                color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: '14px', lineHeight: 1.55,
                border: msg.role === 'bot' ? '1px solid var(--border-soft)' : 'none',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: 'flex-start', padding: '12px 16px',
                background: 'var(--border-soft)',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid var(--border-soft)',
              }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#3BB77E', opacity: 0.6,
                      animation: `badgePulse 1.2s ${delay}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)} style={{
                  padding: '6px 12px', fontSize: '12px',
                  background: '#D8EDDE', color: '#3BB77E',
                  border: '1px solid rgba(59, 183, 126,0.15)',
                  borderRadius: '999px', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = '#c4e4cc'}
                  onMouseOut={e => e.currentTarget.style.background = '#D8EDDE'}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-main)',
            display: 'flex', gap: '8px', alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '999px',
                border: '1.5px solid var(--border-main)',
                background: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '14px', outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#3BB77E'}
              onBlur={e => e.target.style.borderColor = 'var(--border-main)'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: input.trim() && !loading ? '#3BB77E' : 'var(--border-main)',
                border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}
            >↑</button>
          </div>
        </div>
      )}
    </>
  );
}
