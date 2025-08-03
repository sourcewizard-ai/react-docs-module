"use client";
import React, { createContext, useContext } from "react";
import type { DocsJsonConfig } from "./util";

export interface ThemeColors {
  primary: string;
  light?: string;
  dark?: string;
}

export interface DocsTheme {
  colors: ThemeColors;
  name: string;
  theme: string;
}

const DocsThemeContext = createContext<DocsTheme | null>(null);

export interface DocsThemeProviderProps {
  config: DocsJsonConfig;
  children: React.ReactNode;
}

export function DocsThemeProvider({ config, children }: DocsThemeProviderProps) {
  const theme: DocsTheme = {
    colors: config.colors,
    name: config.name,
    theme: config.theme,
  };

  return (
    <DocsThemeContext.Provider value={theme}>
      <div
        style={{
          '--docs-primary': theme.colors.primary,
          '--docs-primary-light': theme.colors.light || theme.colors.primary,
          '--docs-primary-dark': theme.colors.dark || theme.colors.primary,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme(): DocsTheme {
  const context = useContext(DocsThemeContext);
  if (!context) {
    throw new Error('useDocsTheme must be used within a DocsThemeProvider');
  }
  return context;
}

export function useDocsColors(): ThemeColors {
  const theme = useDocsTheme();
  return theme.colors;
}