import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '您好！我是 ZYS 数字艺术与智能建造工作室的 AI 业务顾问 LUMI。我可以为您解答 3D 打印建造、交互装置艺术、AR 沙盘及智能数字生命等任何业务问题。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input, [...messages, userMessage]);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-96 bg-panel border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#0e1715] p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#9de8cf]" />
                <h3 className="font-mono text-xs font-bold text-white tracking-widest">LUMI CONSULTANT</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/40 hover:text-white transition-colors cursor-pointer" 
                data-hover="true"
                data-cursor-text="CLOSE"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-64 md:h-80 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#f3f0e8] text-[#050706] font-medium'
                        : 'bg-white/5 text-[#8d928d] border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 flex gap-1 border border-white/5">
                    <span className="w-1.5 h-1.5 bg-[#9de8cf] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#9de8cf] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#9de8cf] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 bg-[#080a09]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="咨询业务、案例或合作流程..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-xs focus:outline-none px-2 py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-white text-black p-2 hover:bg-[#9de8cf] transition-colors disabled:opacity-30 cursor-pointer"
                  data-hover="true"
                  data-cursor-text="SEND"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 bg-panel border border-white/10 flex items-center justify-center shadow-xl z-50 cursor-pointer text-white hover:border-white/30 hover:bg-[#0e1715] transition-colors"
        data-hover="true"
        data-cursor-text={isOpen ? "CLOSE" : "CHAT"}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
