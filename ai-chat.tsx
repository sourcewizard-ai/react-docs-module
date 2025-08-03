"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from "./mdx/code-block";
import { ReactDocsConfig } from "./config";
import { useDocsColors } from "./theme-context";

interface Message {
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
  id?: string;
}

const MemoizedMarkdown = React.memo(({ content }: { content: string }) => (
  <ReactMarkdown
    className="w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_p]:leading-relaxed"
    components={{
      code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        if (match) {
          const codeContent = Array.isArray(children)
            ? children.join('')
            : String(children);

          return (
            <div className="max-w-full overflow-auto">
              <CodeBlock
                {...props}
                className={className}
              >
                {codeContent}
              </CodeBlock>
            </div>
          );
        }
        return (
          <code {...props} className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
));

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

const Message = React.memo(({ message }: { message: Message }) => (
  <div className="rounded-lg bg-gray-800/50 p-4">
    <div className="flex gap-3 items-start">
      <div className={`p-2 rounded-md ${message.role === 'assistant'
        ? 'bg-blue-500/10 text-blue-400'
        : 'bg-gray-700/50 text-gray-400'
        } mt-0.5`}>
        {message.role === 'assistant' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="text-sm text-white leading-relaxed">
          <MemoizedMarkdown content={message.content} />
        </div>
      </div>
    </div>
  </div>
));

Message.displayName = 'Message';

export const AIChatOption = React.memo(({ query, onClick }: { query: string; onClick: () => void }) => {
  const colors = useDocsColors();
  
  return (
    <button
      className="block w-full text-left p-4 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-800"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-md"
          style={{
            backgroundColor: `${colors.primary}10`,
            color: colors.primary,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white mb-1">Ask AI (Experimental)</h3>
          <p className="text-sm text-gray-400">&quot;{query}&quot;</p>
        </div>
      </div>
    </button>
  );
});

AIChatOption.displayName = 'AIChatOption';

export function AIChat({ query, onBack, config }: { query: string; onBack: () => void; config: ReactDocsConfig }) {
  const colors = useDocsColors();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [],
    api: config.aiChatApiPath,
    id: query,
    initialInput: query,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSubmittedInitialMessage = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const behavior = messages.length <= 2 ? "auto" : "smooth";
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (!hasSubmittedInitialMessage.current) {
      const event = new Event('submit');
      Object.defineProperty(event, 'target', { value: { value: query } });
      handleSubmit(event as any);
      hasSubmittedInitialMessage.current = true;
    }
  }, [query, handleSubmit]);

  useEffect(() => {
    if (error) {
      console.error('Chat API Error:', error);
    }
  }, [error]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-medium text-white">Ask AI (Experimental)</h3>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
        {error && (
          <div className="rounded-lg bg-red-900/50 border border-red-900 p-4">
            <div className="text-sm text-red-400">
              Error: Failed to send message. Please try again.
            </div>
          </div>
        )}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-white">
                  <div className="animate-pulse">Thinking</div>
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-4">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a follow-up question..."
          className="w-full bg-gray-800/50 border-gray-700"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-1 top-1 h-8"
          style={{
            backgroundColor: colors.primary,
            '--tw-bg-opacity': '1',
          } as React.CSSProperties}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
