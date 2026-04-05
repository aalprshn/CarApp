import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { chatSearch } from "../utils/api";

export default function ChatBot({ onFiltersApplied }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Tell me what car you're looking for and I'll find it for you." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const data = await chatSearch(msg);
      if (data.filters && Object.keys(data.filters).length > 0) {
        onFiltersApplied(data.filters);
        const parts = [];
        if (data.filters.manufacturer) parts.push(data.filters.manufacturer);
        if (data.filters.year_min) parts.push(`after ${data.filters.year_min}`);
        if (data.filters.price_max) parts.push(`under $${data.filters.price_max.toLocaleString()}`);
        if (data.filters.odometer_max) parts.push(`< ${data.filters.odometer_max.toLocaleString()} mi`);
        if (data.filters.fuel) parts.push(data.filters.fuel);
        if (data.filters.type) parts.push(data.filters.type);
        setMessages(m => [...m, {
          role: "bot",
          text: `Found it! Showing results for: ${parts.join(", ") || "your request"} ✓`
        }]);
      } else {
        setMessages(m => [...m, {
          role: "bot",
          text: "I couldn't parse that. Try: 'Toyota under $15k after 2018' or 'electric SUV in California'"
        }]);
      }
    } catch {
      setMessages(m => [...m, { role: "bot", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Bubble */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gradient flex items-center justify-center shadow-lg glow-blue"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} className="text-white" /></motion.div>
            : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={22} className="text-white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat box */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 glass rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/7">
              <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Assistant</div>
                <div className="text-xs text-slate-500">Powered by GPT-4o</div>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "self-end btn-gradient text-white"
                      : "self-start bg-white/5 border border-white/7 text-slate-300"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {loading && (
                <div className="self-start bg-white/5 border border-white/7 px-3 py-2 rounded-xl">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-white/7">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Toyota under $15k..."
                className="flex-1 bg-surface border border-white/7 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                onClick={send}
                disabled={loading}
                className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-opacity"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
