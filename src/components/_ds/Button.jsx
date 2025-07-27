// components/Button.tsx
import styled, { css } from 'styled-components';

export const VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  DANGER: 'danger',
};

export const Button = styled.button`
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  ${({ theme, variant = VARIANT.PRIMARY, disabled }) => {
    const v = theme.buttons[variant];

    if (variant === VARIANT.TERTIARY) {
      return css`
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.textSecondary};
        border: 1px solid ${({ theme }) => theme.colors.border};

        &:hover {
          color: ${({ theme }) => theme.colors.text};
          border-color: ${({ theme }) => theme.colors.text};
        }
        &:active {
          background: ${v.activeBg};
          color: ${v.activeText};
        }
      `;
    }

    return css`
      background: ${disabled ? v.disabledBg : v.bg};
      color: ${disabled ? v.disabledText : v.text};
      font-weight: ${v.fontWeight || 'normal'};
      border: ${v.border || 'none'};
      &:hover {
        background: ${!disabled && v.hover};
        border-color: initial;
        color: ${disabled ? v.disabledText : v.text};
      }
      &:active {
        background: ${!disabled && v.active};
      }
    `;
  }}
`;
