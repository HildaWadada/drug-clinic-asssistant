"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Trash2, Users, ShieldCheck } from "lucide-react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { TopicChips } from "@/components/chat/TopicChips";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/hooks/useChat";

function WelcomeMessage() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-bl-sm border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm leading-relaxed text-gray-800 dark:text-slate-200 shadow-sm">
          <p className="mb-2">
            👋 <strong>Hello! I am HealthAssist UG.</strong>
          </p>
          <p className="mb-2">
            I can help you understand medicines, explain prescriptions in simple
            language, and find clinics near you — all based on official{" "}
            <strong>Uganda Ministry of Health</strong> and{" "}
            <strong>WHO guidelines</strong>.
          </p>
          <p className="text-gray-500 dark:text-slate-400 text-xs">
            ⚕ I provide general health information only. Always visit a
            health professional for personal medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatPageContent() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const searchParams = useSearchParams();

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
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 md:block">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
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
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {label}
            </a>
          ))}
        </nav>

        {/* Trust signals */}
        <div className="mt-6 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
            Trusted sources
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            Answers grounded in Uganda MoH guidelines and WHO Essential Medicines List.
          </p>
        </div>

        <div className="mt-2 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 mb-1">
            <Users className="h-3.5 w-3.5 text-brand-500" />
            Free to use
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            No sign up required.
          </p>
        </div>

        {messages.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="w-full text-xs text-gray-400 dark:text-slate-500"
            >
              <Trash2 className="mr-1.5 h-3 w-3" />
              Clear chat
            </Button>
          </div>
        )}
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col bg-gray-50 dark:bg-slate-950">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500">
            <MessageSquare className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Medicine Assistant</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">Based on Uganda MoH &amp; WHO guidelines</p>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Messages — show welcome message + chips when empty */}
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col px-4 py-4 gap-4 overflow-y-auto">
            <WelcomeMessage />
            <div>
              <p className="mb-2 text-xs text-gray-400 dark:text-slate-500">Try asking:</p>
              <TopicChips onSelect={sendMessage} />
            </div>
          </div>
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} />
        )}

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
