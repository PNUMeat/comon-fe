import { createContext, useContext } from 'react';

interface KeywordContextType {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export const KeywordContext = createContext<KeywordContextType | null>(null);

export const useKeyword = () => {
  const context = useContext(KeywordContext);
  if (!context) {
    throw new Error('useKeyword must be used within a KeywordProvider');
  }
  return context;
};
