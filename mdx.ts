import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx/components";
import { MDXComponents } from "mdx/types";
import { ReactDocsConfig } from "./config";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(str: string) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractHeadings(source: string): Heading[] {
  const headings: Heading[] = [];
  const lines = source.split("\n");
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code block delimiters
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // Skip if we're inside a code block
    if (inCodeBlock) continue;

    // Match headings, but only if they're not inside a code block
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text);

      headings.push({ level, text, id });
    }
  }

  return headings;
}

export async function getDocBySlug(docsConfig: ReactDocsConfig, slug: string) {
  const directory = path.join(process.cwd(), docsConfig.contentPath);
  const fullPath = path.join(directory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content: source } = matter(fileContents);
  const headings = extractHeadings(source);

  return {
    frontmatter,
    content: await MDXRemote({
      source,
      components: mdxComponents as MDXComponents,
    }),
    headings,
  };
}

export function getAllDocs(docsConfig: ReactDocsConfig) {
  const docs: { slug: string; frontmatter: any }[] = [];

  function traverseDirectory(currentPath: string, baseDir: string) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath, baseDir);
      } else if (file.endsWith(".mdx")) {
        const relativePath = path.relative(baseDir, fullPath);
        const slug = relativePath.replace(/\.mdx$/, "");
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data: frontmatter } = matter(fileContents);

        docs.push({
          slug,
          frontmatter,
        });
      }
    }
  }

  const docsDirectory = path.join(process.cwd(), docsConfig.contentPath);
  traverseDirectory(docsDirectory, docsDirectory);
  return docs;
}

// Cache for docs content
const docsContentCache = new Map<string, string>();

export function getAllDocsContent(docsConfig: ReactDocsConfig): string {
  const cacheKey = docsConfig.contentPath;
  
  if (docsContentCache.has(cacheKey)) {
    return docsContentCache.get(cacheKey)!;
  }

  const content: string[] = [];

  function traverseDirectory(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (file.endsWith(".mdx")) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { content: mdxContent } = matter(fileContents);
        content.push(mdxContent);
      }
    }
  }

  const docsDirectory = path.join(process.cwd(), docsConfig.contentPath);
  traverseDirectory(docsDirectory);
  
  const joinedContent = content.join('\n\n---\n\n');
  docsContentCache.set(cacheKey, joinedContent);
  return joinedContent;
}
