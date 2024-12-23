import { DropdownContext } from '@/components/commons/Dropdown/DropdownContext';

import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import styled from '@emotion/styled';

const DropdownItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  position: fixed;
  transform: translate(-8px, 0);
`;

interface IDropDownItems {
  children: ReactNode;
  dropDownRef: React.Ref<HTMLDivElement>;
  className?: string;
}

export const DropdownItems: React.FC<IDropDownItems> = ({
  children,
  dropDownRef,
  className = 'editor-dropdown-items',
}) => {
  const [items, setItems] = useState<RefObject<HTMLButtonElement>[]>();
  const [cursor, setCursor] = useState<RefObject<HTMLButtonElement>>();

  const registerItem = useCallback(
    (itemRef: RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    },
    [setItems]
  );

  const contextValue = useMemo(
    () => ({
      registerItem,
    }),
    [registerItem]
  );

  useEffect(() => {
    if (items && !cursor) {
      setCursor(items[0]);
    }

    if (cursor && cursor.current) {
      cursor.current.focus();
    }
  }, [items, cursor]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <DropdownItemsWrapper className={className} ref={dropDownRef}>
        {children}
      </DropdownItemsWrapper>
    </DropdownContext.Provider>
  );
};
