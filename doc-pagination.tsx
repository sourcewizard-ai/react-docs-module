import Link from "next/link";
import { ReactDocsConfig } from "./config";

interface Page {
  title: string;
  slug: string;
}

interface Props {
  config: ReactDocsConfig;
  prev?: Page;
  next?: Page;
}

export function DocPagination({ config, prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 flex items-center justify-between border-t border-gray-800 pt-8">
      {prev ? (
        <Link
          href={`${config.basePath}/${prev.slug}`}
          className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M10.5 3.5L5.5 8l5 4.5" />
          </svg>
          <div>
            <div className="text-sm text-gray-500">Previous</div>
            <div className="text-sm font-medium">{prev.title}</div>
          </div>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={`${config.basePath}/${next.slug}`}
          className="group flex items-center gap-3 text-right text-gray-400 hover:text-white transition-colors"
        >
          <div>
            <div className="text-sm text-gray-500">Next</div>
            <div className="text-sm font-medium">{next.title}</div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5.5 3.5l5 4.5-5 4.5" />
          </svg>
        </Link>
      ) : <div />}
    </div>
  );
} 
