import { redirect } from 'next/navigation';
import { getDocsSidebar } from './util';
import { ReactDocsConfig } from './config';

interface DocsIndexProps {
  config: ReactDocsConfig;
}

export function DocsIndex({ config }: DocsIndexProps) {
  const { navigation } = getDocsSidebar(config);

  // Redirect to the first page in navigation
  if (navigation[0]?.pages[0]?.slug) {
    redirect(`${config.basePath}/${navigation[0].pages[0].slug}`);
  }
  return null;
}
