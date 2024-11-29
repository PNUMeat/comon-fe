import { DropdownContext } from '@/components/commons/Dropdown/DropdownContext';

import { ReactNode, useContext, useEffect, useRef } from 'react';

export const DropDownItem: React.FC<{
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ children, onClick }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const dropDownContext = useContext(DropdownContext);

  if (dropDownContext === null) {
    throw new Error('드롭다운 하위에서만 사용이 가능합니다');
  }

  const { registerItem } = dropDownContext;

  useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref);
    }
  }, [ref, registerItem]);

  return <button onClick={onClick}>{children}</button>;
};
