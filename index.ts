export type { ReactDocsConfig, ReactDocsConfigOptions } from "./config";
export { createReactDocsConfig } from "./config";

export { getDocsSidebar } from "./util";
export type { DocsJsonConfig } from "./util";
export { getAllDocs, getAllDocsContent, getDocBySlug } from "./mdx";

// Search functionality
export { buildSearchIndex } from "./search-index";
export { Search } from "./search";

// Chat API
export { streamDocsChatResponse } from "./chat-api";
export type { ModelProvider, Message, FinishResult } from "./chat-api";

// Page components and functions
export { generateDocsMetadata, generateDocsStaticParams, DocsPage } from "./docs-page";
export { DocsIndex } from "./docs-index";

// Layout components
export { DocumentationLayout } from "./documentation-layout";
export { DocsSidebar } from "./docs-sidebar";
export { TableOfContents } from "./table-of-contents";
export { DocPagination } from "./doc-pagination";

// Theme context
export { DocsThemeProvider, useDocsTheme, useDocsColors } from "./theme-context";
export type { ThemeColors, DocsTheme } from "./theme-context";
