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
  width: 100%;
  display: flex;
  flex-direction: column;
  // gap: 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
`;

interface IDropDownItems {
  children: ReactNode;
  dropDownRef: React.Ref<HTMLDivElement>;
}

export const DropDownItems: React.FC<IDropDownItems> = ({
  children,
  dropDownRef,
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
      <DropdownItemsWrapper ref={dropDownRef}>{children}</DropdownItemsWrapper>
    </DropdownContext.Provider>
  );
};
