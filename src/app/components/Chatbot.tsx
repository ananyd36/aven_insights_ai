"use client";

import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface Message {
  sender: "user" | "bot";
  text: string;
  source?: "knowledge_base" | "gemini_flash";
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: "Thinking..." }]);
    const currentInput = input;
    setInput("");
    try {
      const res = await fetch("/api/query-knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentInput })
      });
      const data = await res.json();
      
      const responseText = data.answer || "Sorry, I couldn&#39;t find an answer.";
      
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove the "Thinking..." message
        { 
          sender: "bot", 
          text: responseText,
          source: data.source
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Sorry, there was an error getting the answer." }
      ]);
    }
  };

  const handleRefreshKnowledgeBase = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/refresh-knowledge-base", {
        method: "POST",
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Knowledge base refreshed!" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error refreshing knowledge base." },
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex flex-col">
      <Navbar />
      
      {/* Modal for refreshing knowledge base */}
      {isRefreshing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 flex flex-col items-center border border-zinc-700">
            <div className="mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
            <div className="text-white text-lg font-semibold">Refreshing Aven&#39;s Knowledge Base...</div>
          </div>
        </div>
      )}
      
      {/* Refresh Knowledge Base Button */}
      <button
        onClick={handleRefreshKnowledgeBase}
        className="fixed top-20 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isRefreshing}
      >
        Refresh Knowledge Base
      </button>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-zinc-950/90 border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">Aven Insights</h1>
          <div className="h-80 overflow-y-auto bg-zinc-900 rounded-lg p-4 mb-4 border border-zinc-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-zinc-800 text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  {msg.source === "gemini_flash" && (
                    <div className="mt-2 text-xs text-zinc-400 italic">
                      💡 AI Response - Please verify with official sources
                    </div>
                  )}
                  {msg.source === "knowledge_base" && (
                    <div className="mt-2 text-xs text-emerald-400 font-medium">
                      ✅ Verified from Aven&#39;s Knowledge Base
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg bg-zinc-800 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              disabled={isRefreshing}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 