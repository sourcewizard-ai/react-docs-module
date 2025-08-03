export interface ReactDocsConfig {
  basePath: string;
  contentPath: string;
  searchApiPath: string;
  aiChatApiPath: string;
}

export interface ReactDocsConfigOptions {
  basePath?: string;
  contentPath?: string;
  searchApiPath?: string;
  aiChatApiPath?: string;
}

const DEFAULT_CONFIG: ReactDocsConfig = {
  basePath: "/docs",
  contentPath: "content/docs",
  searchApiPath: "/api/docs/search-index",
  aiChatApiPath: "/api/docs/chat",
};

export function createReactDocsConfig(options: ReactDocsConfigOptions = {}): ReactDocsConfig {
  return {
    basePath: options.basePath ?? DEFAULT_CONFIG.basePath,
    contentPath: options.contentPath ?? DEFAULT_CONFIG.contentPath,
    searchApiPath: options.searchApiPath ?? DEFAULT_CONFIG.searchApiPath,
    aiChatApiPath: options.aiChatApiPath ?? DEFAULT_CONFIG.aiChatApiPath,
  };
}
