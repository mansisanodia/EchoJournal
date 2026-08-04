import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const AIChatReflection = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your private EchoAI reflection companion. I can analyze patterns across all your journal entries to help you gain emotional clarity. What would you like to explore today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat-reflection', { message: userMsg });
      if (res.data.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I couldn't generate a reflection response right now." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Server error connecting to EchoAI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-50 border border-sage-100 text-xs font-semibold text-sage-600 mb-2">
            <Bot className="w-3.5 h-3.5 text-sage-500" /> Journal-Aware Companion
          </div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">AI Chat Reflection</h1>
          <p className="text-sm text-sage-500">
            Have a mindful dialogue with an AI trained on your own personal growth journey
          </p>
        </div>

        <button
          onClick={() => setMessages([{ sender: 'ai', text: "Session reset. What shall we reflect on next?" }])}
          className="btn-ghost text-xs px-4 py-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="card rounded-3xl p-6 h-[520px] flex flex-col justify-between shadow-nature-md bg-white">
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user' ? 'bg-terra-500 text-white' : 'bg-sage-100 text-sage-600 border border-sage-200'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[78%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-terra- gradient text-white shadow-terra-glow rounded-tr-none'
                  : 'bg-cream-100 border border-cream-200 text-sage-800 rounded-tl-none font-serif'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-600">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-sage-500 italic animate-pulse">
                EchoAI is contemplating your journal context...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="pt-4 border-t border-sage-100 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask EchoAI e.g. 'What triggers my stress most?' or 'How has my sleep improved?'..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-nature py-3 text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-5 py-3 text-xs shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-sage-400">
        <ShieldCheck className="w-4 h-4 text-sage-500" />
        <span>Your chat messages stay private and are processed in-memory for this session only.</span>
      </div>
    </div>
  );
};

export default AIChatReflection;
