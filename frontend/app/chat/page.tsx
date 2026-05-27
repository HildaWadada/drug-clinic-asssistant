/**
 * page.tsx — Chat interface (/chat)
 * Full chat UI: sidebar, message window, input bar.
 * Reads ?q= param to pre-fill the first question.
 */

"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Trash2 } from "lucide-react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { TopicChips } from "@/components/chat/TopicChips";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/hooks/useChat";

function ChatPageContent() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const searchParams = useSearchParams();

  // Send the ?q= question automatically on first load
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      sendMessage(decodeURIComponent(q));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-100 bg-white p-3 md:block">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Quick links
        </p>
        <nav className="flex flex-col gap-0.5">
          {[
            { href: "/chat", label: "Ask a question" },
            { href: "/medicines", label: "Medicines A–Z" },
            { href: "/clinics", label: "Find clinics" },
            { href: "/about", label: "About & Disclaimer" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {label}
            </a>
          ))}
        </nav>

        {messages.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="w-full text-xs text-gray-400"
            >
              <Trash2 className="mr-1.5 h-3 w-3" />
              Clear chat
            </Button>
          </div>
        )}
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500">
            <MessageSquare className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Medicine Assistant</p>
            <p className="text-xs text-gray-400">Based on Uganda MoH &amp; WHO guidelines</p>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Topic chips when empty */}
        {messages.length === 0 && (
          <div className="px-4 pb-3">
            <p className="mb-2 text-xs text-gray-400">Try asking:</p>
            <TopicChips onSelect={sendMessage} />
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageContent />
    </Suspense>
  );
}
