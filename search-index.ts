import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ReactDocsConfig } from "./config";

export interface SearchResult {
  title: string;
  content: string;
  url: string;
  snippet?: string;
  score?: number;
}

export function buildSearchIndex(config: ReactDocsConfig): SearchResult[] {
  const docsDirectory = path.join(process.cwd(), config.contentPath);
  const searchIndex: SearchResult[] = [];

  function processDirectory(dir: string, baseUrl: string = "") {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath, `${baseUrl}${item}/`);
      } else if (item.endsWith(".mdx")) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data: frontmatter, content } = matter(fileContents);
        const slug = item.replace(/\.mdx$/, "");
        const url = config.basePath + `/${baseUrl}${slug}`;

        // Clean up the content by removing markdown syntax
        const cleanContent = content
          .replace(/```[\s\S]*?```/g, "") // Remove code blocks
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links but keep text
          .replace(/[#*`_]/g, "") // Remove markdown syntax
          .replace(/\n+/g, " ") // Replace newlines with spaces
          .trim();

        searchIndex.push({
          title: frontmatter.title || slug,
          content: cleanContent,
          url,
        });
      }
    });
  }

  processDirectory(docsDirectory);
  return searchIndex;
} 
