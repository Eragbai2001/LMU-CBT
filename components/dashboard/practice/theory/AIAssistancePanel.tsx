"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface AIAssistancePanelProps {
  isOpen: boolean;
  onClose: () => void;
  questionContent: string;
  currentAnswer: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "templates" | "answer">("chat");

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
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: {
            questionContent,
            currentAnswer: currentAnswer || "",
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const responseData = await response.json();

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
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-white">
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
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 px-2 flex bg-white">
        <button 
          className={cn(
            "px-4 py-2 text-sm border-b-2 transition-colors",
            activeTab === "chat" 
              ? "border-blue-600 text-blue-600 font-medium" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button 
          className={cn(
            "px-4 py-2 text-sm border-b-2 transition-colors",
            activeTab === "templates" 
              ? "border-blue-600 text-blue-600 font-medium" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
      </div>

      {activeTab === "chat" && (
        <>
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

          {/* Messages area - with max height */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] bg-white">
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
                    <div className="text-sm prose prose-sm max-w-none">
                      {msg.role === "user" ? (
                        <p className="text-white whitespace-pre-line m-0">{msg.content}</p>
                      ) : (
                        <ReactMarkdown
                          rehypePlugins={[rehypeSanitize]}
                          remarkPlugins={[remarkGfm]}
                          className="text-gray-800 whitespace-pre-line m-0"
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
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
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start">
                <HelpCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-white">
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
                aria-label="Send message"
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
        </>
      )}

      {activeTab === "templates" && (
        <div className="flex-1 overflow-y-auto p-4 bg-white max-h-[500px]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Common Question Templates</h3>
            
            <div className="space-y-2">
              <button 
                onClick={() => handleHelpRequest("What are the key concepts I should include in my answer?")}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <p className="font-medium text-gray-800">Key Concepts</p>
                <p className="text-gray-600 text-xs mt-1">Identify the main concepts to include in your answer</p>
              </button>
              
              <button 
                onClick={() => handleHelpRequest("Can you provide a structured outline for my answer?")}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <p className="font-medium text-gray-800">Answer Structure</p>
                <p className="text-gray-600 text-xs mt-1">Get a suggested structure for organizing your response</p>
              </button>
              
              <button 
                onClick={() => handleHelpRequest("What examples should I include to support my answer?")}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <p className="font-medium text-gray-800">Relevant Examples</p>
                <p className="text-gray-600 text-xs mt-1">Find appropriate examples to strengthen your answer</p>
              </button>
              
              <button 
                onClick={() => handleHelpRequest("What are common mistakes to avoid when answering this question?")}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <p className="font-medium text-gray-800">Common Pitfalls</p>
                <p className="text-gray-600 text-xs mt-1">Learn what mistakes to avoid in your answer</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
