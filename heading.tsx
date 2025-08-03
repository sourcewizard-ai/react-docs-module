"use client";
import { useState } from "react";
import { cn } from "./cn";
import React from "react";

interface HeadingProps {
  level: 1 | 2 | 3;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, id, children, className }: HeadingProps) {
  const [copied, setCopied] = useState(false);
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tag
      id={id}
      className={cn(
        "group relative flex items-center scroll-mt-24",
        level === 1 && "text-3xl font-medium mb-6 mt-6",
        level === 2 && "text-2xl font-medium mb-4 mt-8",
        level === 3 && "text-lg font-medium mb-4 mt-6",
        className
      )}
    >
      <a href={`#${id}`} className="no-underline">
        {children}
      </a>
      <button
        onClick={copyLink}
        className="invisible ml-2 group-hover:visible"
        aria-label="Copy link to heading"
      >
        {copied ? (
          <span className="text-green-500 text-sm">✓</span>
        ) : (
          <svg
            className="w-5 h-5 text-gray-400 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        )}
      </button>
    </Tag>
  );
} 
