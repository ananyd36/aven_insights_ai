"use client";

import React, { useState, useRef, useEffect } from "react";


interface Message {
  sender: "user" | "bot";
  text: string;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
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
      console.log(data);
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove the "Thinking..." message
        
        { sender: "bot", text: data.answer || "Sorry, I couldn't find an answer." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Sorry, there was an error getting the answer." }
      ]);
    }
  };

  const handleMicClick = () => {
    console.log("Microphone button clicked. Integrate voice here.");
  };

  const handleRefreshKnowledgeBase = async () => {
    try {
      const res = await fetch("/api/refresh-knowledge-base", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        console.log("Knowledge base refreshed!", data.data.exaResult);
      } else {
        console.error("Refresh failed:", data.error );
      }
    } catch (err) {
      console.error("Error refreshing knowledge base:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8">
      {/* Refresh Knowledge Base Button */}
      <button
        onClick={handleRefreshKnowledgeBase}
        className="fixed top-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Refresh Knowledge Base
      </button>
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
            type="button"
            onClick={handleMicClick}
            className="flex items-center justify-center bg-zinc-800 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Voice chat"
          >
            {/* Microphone SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 01-6 0V7a3 3 0 016 0v5z" />
            </svg>
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}; 