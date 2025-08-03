"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import type { SearchResult } from "./search-index";
import { AIChat, AIChatOption } from "./ai-chat";
import { ReactDocsConfig } from "./config";
import { useDocsColors } from "./theme-context";

// Singleton to cache search index
class SearchIndexCache {
  private static instances: Map<string, SearchIndexCache> = new Map();
  private searchIndex: SearchResult[] | null = null;
  private loading = false;
  private callbacks: ((index: SearchResult[]) => void)[] = [];

  constructor(private config: ReactDocsConfig) { }

  static getInstance(config: ReactDocsConfig): SearchIndexCache {
    const key = config.searchApiPath;
    if (!SearchIndexCache.instances.has(key)) {
      SearchIndexCache.instances.set(key, new SearchIndexCache(config));
    }
    return SearchIndexCache.instances.get(key)!;
  }

  async getSearchIndex(): Promise<SearchResult[]> {
    if (this.searchIndex) {
      return this.searchIndex;
    }

    if (this.loading) {
      return new Promise((resolve) => {
        this.callbacks.push(resolve);
      });
    }

    this.loading = true;
    try {
      const response = await fetch(this.config.searchApiPath);
      const data = await response.json();
      this.searchIndex = data;
      this.callbacks.forEach(callback => callback(data));
      this.callbacks = [];
      return data;
    } finally {
      this.loading = false;
    }
  }
}

interface SearchResultWithScore extends SearchResult {
  score: number;
  snippet: string;
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ?
      <mark key={i} className="bg-yellow-500/20 text-yellow-200 rounded px-0.5">{part}</mark> :
      part
  );
}

export interface SearchProps {
  config: ReactDocsConfig;
}

export function Search({ config }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultWithScore[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const router = useRouter();
  const colors = useDocsColors();

  useEffect(() => {
    // Detect if user is on macOS
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    // Load search index using cache
    const cache = SearchIndexCache.getInstance(config);
    cache.getSearchIndex().then((data) => setSearchIndex(data));

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [config]);

  useEffect(() => {
    const search = async () => {
      setIsLoading(true);
      // Only search if query has 2 or more characters
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const searchQuery = query.toLowerCase();
      const filtered = searchIndex
        .map(item => {
          const titleMatch = item.title.toLowerCase().includes(searchQuery);
          const contentMatch = item.content.toLowerCase().includes(searchQuery);

          if (!titleMatch && !contentMatch) return null;

          // Find the best content snippet
          let snippet = item.content;
          if (contentMatch) {
            const index = item.content.toLowerCase().indexOf(searchQuery);
            const start = Math.max(0, index - 100);
            const end = Math.min(item.content.length, index + 100);
            snippet = (start > 0 ? "..." : "") +
              item.content.slice(start, end) +
              (end < item.content.length ? "..." : "");
          }

          return {
            ...item,
            snippet,
            score: titleMatch ? 2 : 1,
          };
        })
        .filter((item): item is SearchResultWithScore => item !== null)
        .sort((a, b) => b.score - a.score);

      setResults(filtered);
      setIsLoading(false);
    };

    const debounce = setTimeout(search, 200);
    return () => clearTimeout(debounce);
  }, [query, searchIndex]);

  const handleSelect = (result: SearchResultWithScore) => {
    router.push(result.url);
    setOpen(false);
  };

  const handleAIChat = () => {
    setShowAIChat(true);
  };

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground bg-gray-800/50 hover:bg-gray-800 border-0 hover:text-gray-100"
        style={{
          '--ring-color': colors.primary,
        } as React.CSSProperties}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex items-center">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search documentation or ask AI...
        </span>
        <kbd className="pointer-events-none absolute right-2 top-[50%] translate-y-[-50%] inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
          {isMac ? (
            <span className="text-xs">⌘</span>
          ) : (
            <span className="text-xs">Ctrl</span>
          )}
          + K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setShowAIChat(false);
          setQuery("");
        }
      }}>
        <DialogContent
          className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl shadow-2xl backdrop-blur-sm bg-gray-900/95 border border-gray-800 rounded-lg overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 6rem)' }}
        >
          <DialogTitle className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0, 0, 0, 0)' }}>
            Search Documentation
          </DialogTitle>
          {!showAIChat ? (
            <div className="flex flex-col" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
              <div className="shrink-0 p-4 border-b border-gray-800">
                <Input
                  placeholder="Search documentation or ask AI..."
                  className="w-full bg-gray-800/50 border-gray-700"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="min-h-0 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {isLoading ? (
                    <div className="text-sm text-gray-400">Searching...</div>
                  ) : query.length < 2 ? (
                    <div className="text-sm text-gray-400">Enter at least 2 characters to search...</div>
                  ) : (
                    <>
                      {query.length >= 2 && <AIChatOption query={query} onClick={handleAIChat} />}
                      {results.length > 0 ? (
                        <div className="space-y-4">
                          {results.map((result) => (
                            <button
                              key={result.url}
                              className="block w-full text-left p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                              onClick={() => handleSelect(result)}
                            >
                              <h3 className="text-sm font-medium text-white mb-1">
                                {highlightText(result.title, query)}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {highlightText(result.snippet, query)}
                              </p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">No documentation results found</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
              <div className="p-4">
                <AIChat
                  query={query}
                  onBack={() => setShowAIChat(false)}
                  config={config}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
