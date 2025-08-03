import { DocsSidebar } from "./docs-sidebar";
import { TableOfContents } from "./table-of-contents";
import { Search } from "./search";
import { DocPagination } from "./doc-pagination";
import { ReactDocsConfig } from "./config";
import { DocsThemeProvider } from "./theme-context";
import { getDocsSidebar } from "./util";

interface Props {
  config: ReactDocsConfig;
  navigation: any;
  children: React.ReactNode;
  currentPath: string;
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
}

export function DocumentationLayout({
  config,
  navigation,
  children,
  currentPath,
  headings,
}: Props) {
  // Get docs configuration for theming
  const { config: docsConfig } = getDocsSidebar(config);
  
  // Find current page and get prev/next
  const allPages = navigation.flatMap((section: any) => section.pages);
  const currentPageIndex = allPages.findIndex(
    (page: any) => config.basePath + `/${page.slug}` === currentPath
  );
  const prevPage =
    currentPageIndex > 0 ? allPages[currentPageIndex - 1] : undefined;
  const nextPage =
    currentPageIndex < allPages.length - 1
      ? allPages[currentPageIndex + 1]
      : undefined;

  return (
    <DocsThemeProvider config={docsConfig}>
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-0">
            <div className="py-4">
              <DocsSidebar
                config={config}
                navigation={navigation}
                currentPath={currentPath}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Sticky Search Container */}
          <div className="sticky top-0 z-50 bg-gray-900/95 border-b border-gray-800">
            <div className="py-4">
              <div className="flex items-center gap-1">
                <div className="md:hidden">
                  <DocsSidebar
                    config={config}
                    navigation={navigation}
                    currentPath={currentPath}
                  />
                </div>
                <div className="flex-1 md:max-w-2xl md:mx-auto">
                  <Search config={config} />
                </div>
              </div>
            </div>
          </div>

          <main className="py-8 max-w-2xl mx-auto">
            <div className="relative z-0">
              {children}
              <DocPagination config={config} prev={prevPage} next={nextPage} />
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-0">
            <div className="py-4">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </DocsThemeProvider>
  );
}
