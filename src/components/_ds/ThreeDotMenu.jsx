import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Button, BUTTON_VARIANT } from '.';

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled(Button)`
  border: none;
  font-size: 24px;
  padding: 4px 8px;
  border-radius: 50%;
  height: 40px;
  width: 40px;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  list-style: none;
  padding: 4px 0;
  margin: 4px 0 0;
  min-width: 140px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
`;

const MenuAction = styled.button`
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.cardHover};
    color: ${({ theme }) => theme.colors.textSecondary};
    outline: none;
  }
`;

const Icon = styled.i``;

export default function ThreeDotMenu({ options }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === 'Escape') {
      setOpen(false);
      buttonRef.current.focus();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handle = (e) => handleKeyDown(e);
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      const item = menuRef.current?.querySelectorAll('button')[focusedIndex];
      item?.focus();
    }
  }, [focusedIndex, open]);

  return (
    <MenuWrapper>
      <MenuButton
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="menu-list"
        onClick={toggleMenu}
        aria-label="Open user actions"
        variant={BUTTON_VARIANT.PRIMARY}
      >
        ⋮
      </MenuButton>
      {open && (
        <Dropdown id="menu-list" role="menu" ref={menuRef}>
          {options.map((item) => (
            <MenuItem key={item.label} role="none">
              <MenuAction
                role="menuitem"
                tabIndex={-1}
                onClick={(e) => {
                  item.onClick(e);
                  setOpen(false);
                }}
              >
                {item.icon && <Icon as={item.icon} />}
                {item.label}
              </MenuAction>
            </MenuItem>
          ))}
        </Dropdown>
      )}
    </MenuWrapper>
  );
}
