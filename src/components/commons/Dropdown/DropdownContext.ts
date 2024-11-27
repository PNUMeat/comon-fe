import { createContext } from 'react';

type DropdownContextType = {
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void;
};

export const DropdownContext = createContext<DropdownContextType | null>(null);
