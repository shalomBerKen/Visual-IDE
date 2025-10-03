import React, { createContext, useContext, useMemo } from 'react';
import type { LanguageService } from '../core/interfaces/LanguageService';
import { PythonLanguageService } from '../core/languages/PythonLanguageService';

interface LanguageContextType {
  languageService: LanguageService;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  /** Optional: specify a different language service. Defaults to Python. */
  service?: LanguageService;
}

/**
 * Provider for language service
 * Wraps the app and provides access to compiler/parser for the current language
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  service
}) => {
  // Create language service once and memoize it
  const languageService = useMemo(() => {
    return service || new PythonLanguageService();
  }, [service]);

  const value = useMemo(() => ({
    languageService,
    languageName: languageService.name
  }), [languageService]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access the current language service
 * @throws Error if used outside LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
