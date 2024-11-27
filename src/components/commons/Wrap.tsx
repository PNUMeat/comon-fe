import { ReactNode } from 'react';

export const Wrap: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>{children}</div>
);
