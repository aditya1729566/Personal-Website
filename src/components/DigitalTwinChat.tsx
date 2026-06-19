"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquare, Send, X } from "lucide-react";

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
        "Hi, I can answer questions about Aditya's background, current study areas, projects, research interests, and goals using the facts on this site.",
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
            className="fixed bottom-24 right-4 z-50 flex max-h-[78vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-white shadow-2xl sm:right-6"
            role="dialog"
            aria-label="Digital twin chat"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface text-accent-blue">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Digital Twin</p>
                  <p className="text-xs text-muted">Answers from site facts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted transition hover:bg-surface hover:text-foreground"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[86%] rounded-lg px-3.5 py-2.5 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-accent-blue text-white"
                        : "border border-border bg-surface text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-muted">
                    <Loader2 size={16} className="animate-spin" />
                    Checking the profile...
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !loading && (
              <div className="border-t border-border px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:border-accent-blue hover:text-accent-blue"
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
              className="border-t border-border p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
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
                  className="max-h-24 flex-1 resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent-blue focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 sm:right-6"
        aria-label={open ? "Close digital twin chat" : "Open digital twin chat"}
        aria-expanded={open}
      >
        {open ? <X size={17} /> : <MessageSquare size={17} />}
        <span>{open ? "Close" : "Ask"}</span>
      </button>
    </>
  );
}
