import { createContext, useContext } from 'react';

interface KeywordContextType {
  keyword: string;
  setKeyword: (keyword: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const KeywordPageControlContext =
  createContext<KeywordContextType | null>(null);

export const useKeyword = () => {
  const context = useContext(KeywordPageControlContext);
  if (!context) {
    throw new Error('useKeyword must be used within a KeywordProvider');
  }
  return context;
};
