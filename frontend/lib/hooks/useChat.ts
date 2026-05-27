"use client";

import { useState, useCallback } from "react";
import { api } from "../api";
import { generateId } from "../utils";
import type { ChatMessage } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: question.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.chat({ question: question.trim() });

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        is_grounded: response.is_grounded,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
