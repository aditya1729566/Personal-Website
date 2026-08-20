"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquare, Send, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Summarize Aditya's projects",
  "What is Aditya studying right now?",
  "What is his quant research about?",
  "What are his long-term goals?",
];

export default function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "This desk uses Aditya's profile record. Ask about his Kalman-filter research, projects, reading, or current study.",
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
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(1) }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "The assistant could not respond.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            className="museum-chat-panel"
            data-no-solar-explore
            role="dialog"
            aria-label="Ask about Aditya"
          >
            <div className="museum-chat-header">
              <div>
                <p>Inquiry desk</p>
                <span>Questions about the collection and its owner</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="museum-chat-close"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="museum-chat-messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`museum-chat-message ${message.role}`}>
                  <div>
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="museum-chat-message assistant">
                  <div className="museum-chat-loading">
                    <Loader2 size={16} className="animate-spin" />
                    Checking the catalogue...
                  </div>
                </div>
              )}

              {error && (
                <p className="museum-chat-error">
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !loading && (
              <div className="museum-chat-prompts">
                <p>Suggested questions</p>
                <div>
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="museum-chat-prompt"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
              className="museum-chat-form"
            >
              <label htmlFor="museum-chat-input">Your question</label>
              <div>
                <textarea
                  id="museum-chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  rows={1}
                  disabled={loading}
                  placeholder="Ask about Aditya..."
                  className="museum-chat-input"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="museum-chat-send"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`museum-chat-trigger${open ? " is-open" : ""}`}
        aria-label={open ? "Close inquiry desk" : "Open inquiry desk"}
        aria-expanded={open}
      >
        {open ? <X size={17} /> : <MessageSquare size={17} />}
        <span>{open ? "Close" : "Inquiry desk"}</span>
      </button>
    </>
  );
}
