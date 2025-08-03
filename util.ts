import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ReactDocsConfig } from "./config";

interface DocPage {
  slug: string;
  title: string;
  icon?: string;
  isExternal?: boolean;
}

interface DocSection {
  group: string;
  pages: DocPage[];
}

export interface DocsJsonConfig {
  theme: string;
  name: string;
  description?: string;
  navigation: {
    groups?: {
      group: string;
      pages: string[];
    }[];
    anchors?: {
      name: string;
      icon: string;
      url: string;
    }[];
    pages?: string[];
  };
  colors: {
    primary: string;
    light?: string;
    dark?: string;
  };
  logo?: {
    dark?: string;
    light?: string;
  };
  favicon?: string;
  navbar?: {
    cta?: {
      type: string;
      url: string;
    };
  };
  footer?: {
    socials?: Record<string, string>;
  };
  feedback?: {
    thumbsRating?: boolean;
  };
}

export function getDocsSidebar(config: ReactDocsConfig) {
  const docsDirectory = path.join(process.cwd(), config.contentPath);
  const docsJsonPath = path.join(process.cwd(), config.contentPath, "docs.json");
  
  if (!fs.existsSync(docsJsonPath)) {
    throw new Error(`docs.json configuration file not found at ${config.contentPath}/docs.json`);
  }
  
  const docsConfig: DocsJsonConfig = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

  const navigation: DocSection[] = [];

  // Add anchors as the first section if they exist
  if (docsConfig.navigation.anchors && docsConfig.navigation.anchors.length > 0) {
    navigation.push({
      group: "Links",
      pages: docsConfig.navigation.anchors.map(anchor => ({
        slug: anchor.url,
        title: anchor.name,
        icon: anchor.icon,
        isExternal: true
      }))
    });
  }

  // Handle groups navigation
  if (docsConfig.navigation.groups) {
    docsConfig.navigation.groups.forEach(section => {
      const pages: DocPage[] = [];

      section.pages.forEach(pagePath => {
        const fullPath = path.join(docsDirectory, `${pagePath}.mdx`);
        if (fs.existsSync(fullPath)) {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data: frontmatter } = matter(fileContents);

          pages.push({
            slug: pagePath,
            title: frontmatter.title || pagePath.split('/').pop()?.replace(/-/g, ' ') || '',
          });
        }
      });

      if (pages.length > 0) {
        navigation.push({
          group: section.group,
          pages,
        });
      }
    });
  }

  // Handle direct pages navigation (if no groups)
  if (docsConfig.navigation.pages && !docsConfig.navigation.groups) {
    const pages: DocPage[] = [];
    
    docsConfig.navigation.pages.forEach(pagePath => {
      const fullPath = path.join(docsDirectory, `${pagePath}.mdx`);
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data: frontmatter } = matter(fileContents);

        pages.push({
          slug: pagePath,
          title: frontmatter.title || pagePath.split('/').pop()?.replace(/-/g, ' ') || '',
        });
      }
    });

    if (pages.length > 0) {
      navigation.push({
        group: "Documentation",
        pages,
      });
    }
  }

  return { navigation, config: docsConfig };
}

export function getAllDocSlugs(config: ReactDocsConfig) {
  const docsDirectory = path.join(process.cwd(), config.contentPath);
  const fileNames = fs.readdirSync(docsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ""),
    }));
}

// Helper function to recursively read all MDX files from a directory
function getAllDocs(dir: string): string[] {
  const files = fs.readdirSync(dir);

  return files.flatMap(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      return getAllDocs(filePath);
    }

    if (file.endsWith('.mdx')) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContents);
      return content;
    }

    return [];
  });
}
