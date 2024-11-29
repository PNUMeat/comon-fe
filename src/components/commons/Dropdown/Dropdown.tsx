import { DropDownItems } from '@/components/commons/Dropdown/DropdownItems';

import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const dropDownPadding = 4;

export const Dropdown: React.FC<{
  buttonLabel: string;
  children: ReactNode;
}> = ({ buttonLabel, children }) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button && dropDown) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
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
      <button type="button" onClick={toggleDropDown} ref={buttonRef}>
        {buttonLabel}
      </button>
      {showDropDown &&
        createPortal(
          <DropDownItems dropDownRef={dropDownRef}>{children}</DropDownItems>,
          document.body
        )}
    </Fragment>
  );
};
