/**
 * useChat.ts
 * Custom hook managing full chat state: history, sending, loading, errors.
 * Uses Zustand so history persists across page navigations in the session.
 */

"use client";

import { useState } from "react";
import { create } from "zustand";
import { sendChatMessage } from "@/lib/api-client";
import { generateId, sanitiseInput } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (question: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const { messages, addMessage, clearMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (rawQuestion: string): Promise<void> => {
    const question = sanitiseInput(rawQuestion);
    if (!question || isLoading) return;

    setError(null);

    // Add user message immediately — do not wait for the AI response
    addMessage({
      id: generateId(),
      role: "user",
      content: question,
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      const response = await sendChatMessage({ question });
      addMessage({
        id: generateId(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        medicine_name: response.medicine_name,
        timestamp: new Date(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get a response.";
      setError(message);
      addMessage({
        id: generateId(),
        role: "assistant",
        content: "Sorry, I could not connect to the server right now. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage, clearChat: clearMessages };
}
