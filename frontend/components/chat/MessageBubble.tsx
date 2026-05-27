/**
 * MessageBubble.tsx
 * Renders a single chat message — either user or assistant.
 * Assistant messages render Markdown and show source citations.
 */

import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import { cn, formatSourceLabel, truncate } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%]", isUser ? "items-end" : "items-start")}>
        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-brand-500 text-white"
              : "rounded-bl-sm border border-gray-100 bg-white text-gray-800 shadow-sm"
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            // Render markdown for AI responses
            <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-900">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Source citations (assistant only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.sources.map((source, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs text-brand-800"
              >
                <FileText className="h-2.5 w-2.5" />
                {truncate(formatSourceLabel(source.source_file), 40)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
