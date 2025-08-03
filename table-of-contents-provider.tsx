"use client";
import { useEffect } from "react";

export function TableOfContentsProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove active class from all links
            document.querySelectorAll('[data-heading-id]').forEach(el => {
              el.classList.remove('text-white');
              el.classList.add('text-gray-400');
            });
            
            // Add active class to current heading's link
            const link = document.querySelector(
              `[data-heading-id="${entry.target.id}"]`
            );
            if (link) {
              link.classList.remove('text-gray-400');
              link.classList.add('text-white');
            }
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    // Observe all headings
    document.querySelectorAll("h1, h2, h3").forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, []);

  return children;
} 