/**
 * ChatWindow.tsx
 * Scrollable message list. Auto-scrolls to the bottom on new messages.
 */

"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MedicineCard } from "./MedicineCard";
import { Spinner } from "@/components/ui/Spinner";
import type { Message } from "@/lib/types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        // Empty state
        <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
          <p className="text-sm">Ask me anything about medicines or health in Uganda.</p>
          <p className="mt-1 text-xs">I will answer based on official MoH and WHO guidelines.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble message={message} />
              {/* Show medicine card below assistant message if a medicine was detected */}
              {message.role === "assistant" && message.medicine_name && (
                <div className="mt-2">
                  <MedicineCard medicineName={message.medicine_name} />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator while loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                <Spinner size="sm" />
                <span>Looking up information…</span>
              </div>
            </div>
          )}

          {/* Invisible anchor for auto-scroll */}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
