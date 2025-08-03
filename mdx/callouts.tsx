import React from "react";

export function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-3 my-3">
      <div className="flex gap-2 items-center text-blue-400 mb-1.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-3V7H7v6h2zM8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
        <span className="font-medium">Info</span>
      </div>
      <div className="text-gray-300 [&>p]:m-0">{children}</div>
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg p-3 my-3">
      <div className="flex gap-2 items-center text-yellow-400 mb-1.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        <span className="font-medium">Warning</span>
      </div>
      <div className="text-gray-300 [&>p]:m-0">{children}</div>
    </div>
  );
} 