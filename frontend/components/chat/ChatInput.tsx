/**
 * ChatInput.tsx
 * Text input bar at the bottom of the chat window.
 * Handles Enter key submission and disabled state while loading.
 */

"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter adds a newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    // Auto-grow textarea up to ~4 lines
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-gray-100 bg-white p-3">
      <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask about a medicine, health topic, or clinic..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
          className={cn(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors",
            value.trim() && !isLoading
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "bg-gray-200 text-gray-400"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-1.5 text-center text-xs text-gray-400">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
