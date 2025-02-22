import { DropdownItems } from '@/components/commons/Dropdown/DropdownItems';
import { Flex } from '@/components/commons/Flex';

import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import dropdownIcon from '@/assets/Posting/dropdownIcon.svg';
import styled from '@emotion/styled';
import { breakpoints } from '@/constants/breakpoints';

const dropDownPadding = 4;

const DropdownIcon = styled.img<{ isClicked?: boolean }>`
  width: 16px;
  margin-left: 8px;
  transform: ${(props) => (props.isClicked ? 'rotate(180deg)' : undefined)};

  @media (max-width: ${breakpoints.mobile}px) {
    width: 12px;
    margin-left: 5px;
  }
`;

export const Dropdown: React.FC<{
  buttonLabel: ReactNode;
  children: ReactNode;
  buttonComponent?: ReactNode;
  className?: string;
  dropdownClassName?: string;
}> = ({
  buttonLabel,
  children,
  className = 'editor-dropdown',
  dropdownClassName = 'editor-dropdown-items',
  buttonComponent,
}) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button && dropDown) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 30)}px`;
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button && showDropDown) {
      const onClick = (e: DocumentEventMap['click']) => {
        const target = e.target;
        if (!button.contains(target as Node)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener('click', onClick);

      return () => {
        document.removeEventListener('click', onClick);
      };
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const moveDropDownOnScroll = () => {
      if (!showDropDown) {
        return;
      }

      const button = buttonRef.current;
      const dropDown = dropDownRef.current;
      if (button && dropDown) {
        const { top } = button.getBoundingClientRect();
        const to = top + button.offsetHeight + dropDownPadding;
        if (to !== dropDown.getBoundingClientRect().top) {
          dropDown.style.top = `${to}px`;
        }
      }
    };
    document.addEventListener('scroll', moveDropDownOnScroll);

    return () => {
      document.removeEventListener('scroll', moveDropDownOnScroll);
    };
  }, [buttonRef, dropDownRef, showDropDown]);

  const toggleDropDown = () => setShowDropDown(!showDropDown);

  return (
    <Fragment>
      <button
        type="button"
        onClick={toggleDropDown}
        ref={buttonRef}
        className={className}
      >
        {buttonComponent ?? (
          <Flex>
            {buttonLabel}
            <DropdownIcon
              src={dropdownIcon}
              alt={'downward arrow icon'}
              isClicked={showDropDown}
            />
          </Flex>
        )}
      </button>
      {showDropDown &&
        createPortal(
          <DropdownItems
            dropDownRef={dropDownRef}
            className={dropdownClassName}
          >
            {children}
          </DropdownItems>,
          document.body
        )}
    </Fragment>
  );
};
