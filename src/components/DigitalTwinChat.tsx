"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Spade, ChessKnight, PokerChip } from "./ChessPokerIcons";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "What's your quant research about?",
  "Tell me about your projects",
  "What are your long-term goals?",
  "Tell me about chess & poker theory",
];

export default function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey — I'm Aditya's digital twin. Ask me anything about my career, research, projects, or chess and poker strategies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(1),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect to Digital Twin.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glossy-chat fixed right-4 bottom-6 z-[70] sm:right-10 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 flex min-h-[420px] max-h-[85vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-accent-gold/25 bg-charcoal glass border-gradient shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-accent-gold/15 bg-charcoal-light px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold">
                  <ChessKnight size={18} />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-syne)] text-xs font-bold text-foreground">
                    Aditya's Digital Twin
                  </p>
                  <p className="text-[8px] tracking-widest uppercase text-accent-gold/75 font-semibold">
                    Strategic AI Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.05] hover:text-foreground cursor-pointer"
                aria-label="Close chat"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-gradient-to-r from-accent-gold to-accent-magenta text-charcoal font-semibold shadow-sm"
                        : "rounded-bl-sm border border-accent-gold/10 bg-felt-dark/30 text-muted font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-accent-gold/15 bg-felt-dark/30 px-3.5 py-2 text-xs text-accent-gold">
                    <Loader2 size={12} className="animate-spin text-accent-gold" />
                    <span className="text-[10px] font-semibold">Calculating odds...</span>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-center text-[10px] text-poker-red font-semibold">{error}</p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-3 flex flex-col gap-1.5 select-none">
                <p className="text-[8px] font-bold uppercase tracking-wider text-muted">Suggested Queries</p>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="rounded-lg border border-accent-gold/15 bg-charcoal-light px-2 py-1 text-[9px] text-muted text-left transition-all hover:border-accent-gold hover:text-accent-gold cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input form */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-accent-gold/15 bg-charcoal-light p-3"
            >
              <div className="flex items-center gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  disabled={loading}
                  className="max-h-20 flex-1 resize-none rounded-xl border border-accent-gold/15 bg-charcoal px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:border-accent-gold focus:outline-none disabled:opacity-50"
                  style={{ scrollbarWidth: "none" }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-gold text-charcoal hover:shadow-[0_0_10px_rgba(207,168,70,0.3)] transition-opacity disabled:opacity-40 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={12} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button (Poker Chip Badge) */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 z-[70] flex items-center gap-2 rounded-full border border-accent-gold/40 bg-charcoal px-4.5 py-3 text-xs font-bold tracking-wider uppercase text-accent-gold shadow-[0_0_20px_rgba(207,168,70,0.25)] hover:border-accent-gold sm:right-6 cursor-pointer"
        aria-label={open ? "Close chat" : "Ask Digital Twin"}
      >
        {open ? (
          <X size={15} />
        ) : (
          <>
            <MessageSquare size={15} />
            <span>Digital Twin</span>
          </>
        )}
      </motion.button>
    </>
  );
}
