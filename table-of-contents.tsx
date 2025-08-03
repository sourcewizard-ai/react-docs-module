import { TableOfContentsProvider } from "./table-of-contents-provider";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
}

function TableOfContentsList({ headings }: Props) {
  return (
    <nav className="sticky top-8 z-0 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h4 className="text-sm font-semibold mb-4 text-gray-400">On this page</h4>
      <ul className="space-y-2.5">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 1) * 16}px` }}
            className="text-sm"
          >
            <a
              href={`#${id}`}
              className="hover:text-white transition-colors text-gray-400 block"
              data-heading-id={id}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function TableOfContents({ headings }: Props) {
  return (
    <TableOfContentsProvider>
      <TableOfContentsList headings={headings} />
    </TableOfContentsProvider>
  );
} 