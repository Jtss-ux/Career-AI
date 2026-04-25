import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Layout, Paperclip, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { marked } from 'marked';
import { Section } from './ui/Section';
import { cn, EASE } from '../lib/utils';

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

const TypingIndicator = ({ duration }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-start gap-4"
  >
    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
      <Bot className="w-5 h-5 text-indigo-400" />
    </div>
    <div className="liquid-glass rounded-2xl rounded-bl-none p-5 flex flex-col gap-3 min-w-[200px]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-indigo-400/60">
        <Sparkles className="w-3 h-3 animate-pulse" />
        <span>Processing: {duration.toFixed(1)}s</span>
      </div>
    </div>
  </motion.div>
);

const ChatMessage = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn("flex items-start gap-3 sm:gap-4", isUser && "flex-row-reverse")}
    >
      <div className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
        isUser ? "bg-indigo-600" : "bg-white/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
        )}
      </div>
      
      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[75%]", isUser && "items-end")}>
        {message.agent && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-2 px-1">
            {message.agent.replace('_', ' ')} System
          </span>
        )}
        
        <div className={cn(
          "p-4 sm:p-5 rounded-2xl group relative",
          isUser 
            ? "bg-indigo-600 text-white rounded-br-none" 
            : "liquid-glass rounded-bl-none text-white/90"
        )}>
          {message.file && (
            <div className="mb-3 px-3 py-1.5 bg-black/20 rounded-xl flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-white/60 w-fit">
              <Paperclip className="w-3 h-3" /> {message.file}
            </div>
          )}
          
          <div 
            className="prose prose-invert max-w-none text-sm leading-relaxed prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5" 
            dangerouslySetInnerHTML={{ __html: marked.parse(message.content || "") }} 
          />
          
          {!isUser && message.duration !== undefined && (
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-mono text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-green-500 rounded-full" />
                {message.duration}s
              </span>
              <span>{message.tokens} tokens</span>
              <span>{message.tps} t/s</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-full text-center px-4 py-12"
  >
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
    </div>
    <h3 className="font-heading text-2xl sm:text-3xl italic mb-3">Ready to Assist</h3>
    <p className="text-white/40 text-sm sm:text-base max-w-sm leading-relaxed">
      Send a command to begin your session with the Orchestrator Core.
    </p>
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {['Analyze data', 'Write code', 'Research topic'].map((suggestion) => (
        <button 
          key={suggestion}
          className="px-4 py-2 text-xs uppercase tracking-widest text-white/40 liquid-glass rounded-full hover:text-white hover:bg-white/5 transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </motion.div>
);

export const AssistantChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isTyping) {
      setLiveDuration(0);
      interval = setInterval(() => {
        setLiveDuration(prev => Number((prev + 0.01).toFixed(2)));
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    fetch('/history').then(r => r.json()).then(data => {
      setMessages(data.history || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim() && !selectedFile) return;
    const userMsg = input;
    const fileToUpload = selectedFile;
    
    setInput('');
    setSelectedFile(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMsg,
      file: fileToUpload ? fileToUpload.name : null 
    }]);
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('text', userMsg);
      if (fileToUpload) {
        formData.append('file', fileToUpload);
      }

      const response = await fetch('/query', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.detail || `Server error (${response.status})`;
        setMessages(prev => [...prev, { role: 'bot', content: `**Error:** ${errMsg}` }]);
        return;
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.response, 
        agent: data.metadata?.agent,
        duration: data.metadata?.duration,
        tokens: data.metadata?.tokens,
        tps: data.metadata?.tps
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "**Connection Error:** Unable to reach the orchestrator. Please try again." }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, selectedFile]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Section id="control-deck" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-[1200px] mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 liquid-glass rounded-full mb-6"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-white/60">Live Connection</span>
        </motion.div>
        <h2 className="font-heading text-4xl sm:text-5xl mb-4 italic">Integrated Command</h2>
        <p className="font-body text-white/40 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[10px] sm:text-xs">Direct Neural Link to Orchestrator Core</p>
      </div>

      <div className="liquid-glass-strong rounded-[2rem] sm:rounded-[3rem] h-[600px] sm:h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/60">Active Session</span>
            {messages.length > 0 && (
              <span className="text-[10px] text-white/30 hidden sm:inline">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-3 sm:gap-4">
            <MessageSquare className="w-4 h-4 text-white/40 hover:text-white/60 cursor-pointer transition-colors" />
            <Layout className="w-4 h-4 text-white/40 hover:text-white/60 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 scroll-smooth custom-scrollbar">
          {messages.length === 0 && !isTyping ? (
            <EmptyState />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} isLast={i === messages.length - 1} />
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {isTyping && <TypingIndicator duration={liveDuration} />}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white/[0.02] border-t border-white/5">
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4"
              >
                <div className="px-4 py-2.5 liquid-glass rounded-xl flex items-center gap-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-white/10 text-white/60 w-fit">
                  <Paperclip className="w-3 h-3 text-indigo-400" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="liquid-glass rounded-2xl sm:rounded-[2rem] flex items-center pr-2 focus-within:ring-2 ring-indigo-500/30 transition-all border border-white/5">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="p-4 sm:p-5 text-white/30 hover:text-indigo-400 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your command..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white p-3 sm:p-4 font-body tracking-wide outline-none placeholder:text-white/20 text-sm sm:text-base"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() && !selectedFile}
              className="px-4 sm:px-8 py-3 sm:py-4 m-1 rounded-xl sm:rounded-2xl bg-white text-black hover:bg-indigo-100 disabled:opacity-20 disabled:hover:bg-white transition-all font-bold uppercase tracking-widest text-[9px] sm:text-[10px] flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};
