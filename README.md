# React Docs Module

A powerful, embeddable documentation system with built-in search and AI chat capabilities. Perfect for creating beautiful, interactive documentation pages with minimal setup.

## Features

- 🎨 **Themeable** - Customize colors and appearance via `docs.json` configuration
- 🔍 **Full-text Search** - Fast, client-side search with caching
- 🤖 **AI Chat** - Integrated AI assistant for documentation Q&A
- 📝 **MDX Support** - Write docs in Markdown with custom components
- 📋 **Mintlify Compatible** - Full support for Mintlify docs.json schema
- 📱 **Responsive** - Mobile-friendly design with adaptive layouts

## Quick Start

### 1. Installation

```bash
npm install react-docs-module
```

### 2. Configuration

Create a `docs.json` file with your documentation configuration using the **Mintlify schema**:

```json
{
  "$schema": "https://leaves.mintlify.com/schema/docs.json",
  "theme": "mint",  
  "name": "My Documentation",
  "description": "Comprehensive documentation for my project",
  "logo": {
    "dark": "/assets/logo-dark.png",
    "light": "/assets/logo-light.png"
  },
  "favicon": "/assets/favicon.png",
  "colors": {
    "primary": "#3B82F6",
    "light": "#60A5FA", 
    "dark": "#1D4ED8"
  },
  "navbar": {
    "cta": {
      "type": "github",
      "url": "https://github.com/your-org/your-repo"
    }
  },
  "navigation": {
    "groups": [
      {
        "group": "Getting Started",
        "pages": [
          "introduction",
          "installation", 
          "quick-start"
        ]
      },
      {
        "group": "API Reference",
        "pages": [
          "api/overview",
          "api/authentication"
        ]
      }
    ]
  },
  "footer": {
    "socials": {
      "github": "https://github.com/your-org/your-repo",
      "twitter": "https://twitter.com/your-handle"
    }
  },
  "feedback": {
    "thumbsRating": true
  }
}
```

### 3. Basic Usage

```tsx
import { DocumentationLayout, createReactDocsConfig } from 'react-docs-module';

// Create config with defaults or custom overrides
const config = createReactDocsConfig({
  basePath: "/docs",
  contentPath: "content/docs",
  // searchApiPath and aiChatApiPath use defaults
});

export default function DocsPage() {
  return (
    <DocumentationLayout
      config={config}
      navigation={navigation}
      currentPath="/docs/introduction"
      headings={headings}
    >
      <div>Your documentation content here</div>
    </DocumentationLayout>
  );
}
```

## Configuration

### ReactDocsConfig

```typescript
interface ReactDocsConfig {
  basePath: string;        // Base URL path for docs
  contentPath: string;     // Path to MDX content files
  searchApiPath: string;   // API endpoint for search index
  aiChatApiPath: string;   // API endpoint for AI chat
}

// Factory function with optional overrides
function createReactDocsConfig(options?: ReactDocsConfigOptions): ReactDocsConfig

interface ReactDocsConfigOptions {
  basePath?: string;       // Default: "/docs"
  contentPath?: string;    // Default: "content/docs"
  searchApiPath?: string;  // Default: "/api/docs/search-index"
  aiChatApiPath?: string;  // Default: "/api/docs/chat"
}
```

### Configuration Examples

```typescript
// Use all defaults
const config = createReactDocsConfig();

// Override specific fields
const config = createReactDocsConfig({
  basePath: "/documentation",
  aiChatApiPath: "/api/custom-chat"
});

// Override all fields
const config = createReactDocsConfig({
  basePath: "/my-docs",
  contentPath: "docs",
  searchApiPath: "/api/search",
  aiChatApiPath: "/api/ai-chat"
});
```

### docs.json Schema (Mintlify Compatible)

The `docs.json` file uses the complete **[Mintlify schema](https://leaves.mintlify.com/schema/docs.json)** for full compatibility:

- **Required**: `theme`, `name`, `colors.primary`, `navigation`
- **Optional**: `description`, `logo`, `favicon`, `navbar`, `footer`, `feedback`, and more
- **Migration**: Existing Mintlify projects can use their `mint.json` structure in `docs.json`

## Components

### Core Components

- `DocumentationLayout` - Main layout wrapper with sidebar and TOC
- `Search` - Search component with AI chat integration
- `DocsIndex` - Documentation index/landing page
- `DocsSidebar` - Navigation sidebar
- `TableOfContents` - Page table of contents
- `DocPagination` - Previous/next page navigation

### Theme System

```tsx
import { DocsThemeProvider, useDocsColors } from 'react-docs-module';

function CustomComponent() {
  const colors = useDocsColors();
  
  return (
    <div style={{ color: colors.primary }}>
      Themed content
    </div>
  );
}
```

### AI Chat Integration

```tsx
import { streamDocsChatResponse } from 'react-docs-module/chat-api';

// API route example
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  return streamDocsChatResponse(
    config,
    messages,
    "You are a helpful documentation assistant.",
    async (result) => {
      // Handle completion
      console.log(result.text);
    }
  );
}
```

## API Reference

### Functions

- `getDocsSidebar(config)` - Generate sidebar navigation from docs.json
- `getAllDocs(config)` - Get all documentation files metadata  
- `getAllDocsContent(config)` - Get all documentation content (cached)
- `getDocBySlug(config, slug)` - Get specific document by slug
- `buildSearchIndex(config)` - Build search index from content
- `streamDocsChatResponse(...)` - Stream AI chat responses

### Types

- `ReactDocsConfig` - Main configuration interface
- `ReactDocsConfigOptions` - Configuration factory options
- `DocsJsonConfig` - docs.json configuration schema (Mintlify compatible)
- `ThemeColors` - Color theme interface
- `ModelProvider` - AI model provider configuration

## Advanced Usage

### Custom Search API

```typescript
// pages/api/search-index.ts
import { buildSearchIndex, createReactDocsConfig } from 'react-docs-module';

const DOCS_CONFIG = createReactDocsConfig({
  contentPath: "content/docs"
});

export default async function handler(req, res) {
  const searchIndex = await buildSearchIndex(DOCS_CONFIG);
  res.json(searchIndex);
}
```

### Custom AI Models

```typescript
const modelProvider: ModelProvider = {
  providerType: 'anthropic',
  model: 'claude-3-sonnet',
  apiKey: process.env.ANTHROPIC_API_KEY
};

streamDocsChatResponse(config, messages, prompt, callback, modelProvider);
```

### Custom Theming

```css
/* Use CSS custom properties set by DocsThemeProvider */
.custom-element {
  color: var(--docs-primary);
  border-color: var(--docs-primary-light);
  background-color: var(--docs-primary-dark);
}
```

## Requirements

- React 19+
- TypeScript 5.6+
- Node.js 18+

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests to the main repository.
