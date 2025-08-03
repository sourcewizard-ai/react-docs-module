"use client";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  if (inline) {
    return (
      <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  const language = className?.replace("language-", "") || "text";

  const copyCode = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative bg-gray-800/50 rounded-lg overflow-x-auto w-full my-4 group"
      style={{ maxWidth: "100%" }}
    >
      <button
        onClick={copyCode}
        className="absolute right-2 top-2 p-2 rounded-md bg-gray-700/50 invisible group-hover:visible hover:bg-gray-700 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-500"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: "transparent",
          fontSize: "1.1rem",
          lineHeight: "1.4",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          maxWidth: "100%",
          overflowX: "auto",
        }}
        wrapLongLines={false}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
