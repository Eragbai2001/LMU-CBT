"use client";

import { useState, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      setError(null);

      // Add user message to the list
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content },
      ]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content }],
          }),
        });

        if (!response.ok) {
          // Get error details from response if possible
          let errorDetails = "";
          try {
            const errorData = await response.json();
            errorDetails = errorData.error || "";
          } catch {
            // If we can't parse the JSON, just use the status
          }

          // Custom error handling to avoid the uncaught error
          setError(`Request failed: ${response.status} ${errorDetails}`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        // Add AI response to the list
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: data.message },
        ]);
      } catch (err) {
        setError("Failed to get response: Network error");
        console.error("Error in chat:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
