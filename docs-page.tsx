import { getDocsSidebar } from './util';
import { ReactDocsConfig } from './config';
import { getAllDocs, getDocBySlug } from './mdx';
import { DocumentationLayout } from './documentation-layout';

interface DocsPageProps {
  config: ReactDocsConfig;
  slug: string[];
}

export interface DocsMetadata {
  title: string;
}

export async function generateDocsMetadata(docsConfig: ReactDocsConfig, slug: string[]): Promise<DocsMetadata> {
  const { navigation } = getDocsSidebar(docsConfig);
  const currentPath = slug.join("/");

  // Find the current page in navigation
  let pageTitle = "Documentation";
  for (const section of navigation) {
    const page = section.pages.find(p => p.slug === currentPath);
    if (page) {
      pageTitle = page.title;
      break;
    }
  }

  return {
    title: pageTitle,
  };
}

export async function generateDocsStaticParams(docsConfig: ReactDocsConfig) {
  const docs = getAllDocs(docsConfig);

  return docs.map((doc: any) => ({
    slug: doc.slug.split('/')
  }));
}

export async function DocsPage({ config, slug }: DocsPageProps) {
  const { navigation } = getDocsSidebar(config);
  const curSlug = slug.join("/");
  const { content, frontmatter, headings } = await getDocBySlug(config, curSlug);
  const currentPath = config.basePath + `/${curSlug}`;
  console.log(currentPath);

  if (!content) {
    return null;
  }

  return (
    <DocumentationLayout
      config={config}
      navigation={navigation}
      currentPath={currentPath}
      headings={headings}
    >
      <div className="prose prose-invert max-w-none">
        <h1 id="title" className="text-3xl font-medium mb-8 mt-2">
          {frontmatter.title}
        </h1>
        {content}
      </div>
    </DocumentationLayout>
  );
}
