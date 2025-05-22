"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistancePanelProps {
  isOpen: boolean;
  onClose: () => void;
  questionContent: string;
  currentAnswer: string;
  correctAnswer?: string;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistancePanel({
  isOpen,
  onClose,
  questionContent,
  currentAnswer,
}: AIAssistancePanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending request to AI assistant...");

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Raw API response:", responseData);

      // More robust message extraction
      let messageContent = "";

      if (typeof responseData.message === "string") {
        // Direct string message
        messageContent = responseData.message;
      } else if (
        responseData.message &&
        typeof responseData.message === "object"
      ) {
        // If it's an object, try to find the text content
        if (responseData.message.text) {
          messageContent = String(responseData.message.text);
        } else if (responseData.message.output_text) {
          messageContent = String(responseData.message.output_text);
        } else if (responseData.message.content) {
          messageContent = String(responseData.message.content);
        }
        // If nothing works, stringify the object
        else {
          messageContent = `AI responded but format was unexpected: ${JSON.stringify(
            responseData.message
          )}`;
        }
      } else {
        messageContent = "Received an empty or invalid response from the AI.";
      }

      // Add assistant message regardless of format
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: messageContent },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get AI response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const handleHelpRequest = (prompt: string) => {
    sendMessage(prompt);
  };

  

  // Only render if the panel is open
  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
              <Sparkles size={16} className="text-blue-600" />
            </div>
            <h2 className="font-medium">AI Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200 px-2 flex">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
          Assistant
        </button>
        <button className="px-4 py-2 text-gray-500 text-sm">Templates</button>
        <button className="px-4 py-2 text-gray-500 text-sm">Your Answer</button>
      </div>

      {/* Quick help options */}
      <div className="bg-gray-50 p-3 flex flex-wrap gap-2 text-sm">
        <button
          onClick={() =>
            handleHelpRequest(
              `Help me outline an answer to this question: "${questionContent}"`
            )
          }
          className="py-1 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Outline an Answer
        </button>

        <button
          onClick={() =>
            handleHelpRequest(
              `Explain the key concepts in this question: "${questionContent}"`
            )
          }
          className="py-1 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Explain Key Concepts
        </button>

        {currentAnswer && (
          <button
            onClick={() =>
              handleHelpRequest(
                `Review my answer and suggest improvements: "${currentAnswer}"`
              )
            }
            className="py-1 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Review My Answer
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Ask for help with your theory answer. The AI can explain concepts,
              outline answers, and review your work.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg max-w-[85%]",
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                )}
              >
                <div className="text-sm whitespace-pre-line">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex">
            <div className="p-3 rounded-lg bg-gray-100 text-gray-800 max-w-[85%] rounded-tl-none">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Debug area */}
      {showDebug && messages.length > 0 && (
        <div className="mx-4 p-2 bg-gray-100 rounded border border-gray-300 text-xs font-mono overflow-x-auto">
          <div className="flex justify-between mb-1">
            <span className="font-bold">Debug: Last Response Format</span>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500"
            >
              Close
            </button>
          </div>
          {typeof messages[messages.length - 1].content === "string"
            ? "✅ Content is proper string format"
            : "⚠️ Unexpected format"}
        </div>
      )}

      {/* Debug toggle button */}
      <div className="flex justify-end mr-4 mb-1">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {showDebug ? "Hide Debug" : "Debug Format"}
        </button>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask for help..."
            className="w-full py-2.5 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={cn(
              "absolute right-1.5 top-1.5 p-1.5 rounded-full",
              isLoading || !inputValue.trim()
                ? "text-gray-300 cursor-not-allowed"
                : "text-blue-500 hover:bg-blue-50"
            )}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <button
            type="button"
            onClick={clearMessages}
            className="hover:text-gray-700"
          >
            Clear conversation
          </button>
        </div>
      </div>
    </div>
  );
}
