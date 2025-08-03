"use client";
import Link from "next/link";
import { cn } from "./cn";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { ReactDocsConfig } from "./config";

interface DocPage {
  slug: string;
  title: string;
  icon?: string;
  isExternal?: boolean;
}

interface Props {
  config: ReactDocsConfig;
  navigation: {
    group: string;
    pages: DocPage[];
  }[];
  currentPath: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: SiGithub,
  discord: SiDiscord,
};

export function DocsSidebar({ config, navigation, currentPath }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-8 w-8 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Navigation Portal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div
            className="
              fixed inset-y-0 left-0 z-50
              w-64 
              bg-gray-900
              overflow-y-auto
              p-4
            "
          >
            <nav>
              {navigation.map((section) => (
                <div key={section.group} className="mb-8">
                  <h5 className="mb-2 text-sm font-semibold text-gray-400">
                    {section.group}
                  </h5>
                  <ul className="space-y-1.5">
                    {section.pages.map((page) => {
                      const IconComponent = page.icon
                        ? iconMap[page.icon]
                        : null;
                      return (
                        <li key={page.slug}>
                          {page.isExternal ? (
                            <a
                              href={page.slug}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md p-1.5 transition-all"
                            >
                              {IconComponent && (
                                <div className="p-1 border border-gray-700 rounded-md">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                              )}
                              {page.title}
                            </a>
                          ) : (
                            <Link
                              href={config.basePath + `/${page.slug}`}
                              className={cn(
                                "block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md p-1.5 transition-all",
                                currentPath === config.basePath + `/${page.slug}` &&
                                "text-white bg-gray-800"
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              {page.title}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav>
          {navigation.map((section) => (
            <div key={section.group} className="mb-8">
              <h5 className="mb-2 text-sm font-semibold text-gray-400">
                {section.group}
              </h5>
              <ul className="space-y-1.5">
                {section.pages.map((page) => {
                  const IconComponent = page.icon ? iconMap[page.icon] : null;
                  return (
                    <li key={page.slug}>
                      {page.isExternal ? (
                        <a
                          href={page.slug}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md p-1.5 transition-all"
                        >
                          {IconComponent && (
                            <div className="p-1 border border-gray-700 rounded-md">
                              <IconComponent className="w-4 h-4" />
                            </div>
                          )}
                          {page.title}
                        </a>
                      ) : (
                        <Link
                          href={`${config.basePath}/${page.slug}`}
                          className={cn(
                            "block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md p-1.5 transition-all",
                            currentPath === `${config.basePath}/${page.slug}` &&
                            "text-white bg-gray-800"
                          )}
                        >
                          {page.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
