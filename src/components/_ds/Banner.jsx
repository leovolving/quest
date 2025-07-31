import { createContext, useContext } from 'react';
import styled, { css } from 'styled-components';

export const VARIANT = {
  INFO: 'info',
  WARN: 'warning',
  SUCCESS: 'success',
  DANGER: 'danger',
};

const BannerContext = createContext({ variant: VARIANT.INFO });

const BannerComponent = styled.aside`
  ${({ theme, variant, stacked = false }) => {
    const v = theme.banner[variant];
    return css`
      background-color: ${v.bg};
      color: ${v.text};
      border: 1px solid ${v.border};
      border-radius: ${theme.borderRadius.sm};
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      display: flex;
      gap: ${theme.spacing.md};
      flex-wrap: wrap;
      flex-direction: ${stacked ? 'column' : 'row'};
      align-items: ${stacked ? 'flex-start' : 'center'};
      justify-content: space-between;
    `;
  }}
`;

const Button = styled.button`
  ${({ theme, variant, floating = false }) => {
    const v = theme.banner[variant];
    return css`
      background-color: ${v.bg};
      color: ${v.text};
      border: ${floating ? 'none' : `2px solid ${v.border}`};
      text-decoration: ${floating ? 'underline' : 'none'};
      border-radius: ${theme.borderRadius.sm};
      display: inline-block;
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      &:hover,
      &:focus {
        background-color: ${v.hover};
        border-color: ${floating ? 'transparent' : v.border};
        color: ${v.text};
      }
      &:focus {
        outline: none;
        border: 2px solid ${v.border};
      }
    `;
  }}
`;

export const Banner = ({ variant = VARIANT.INFO, ...props }) => {
  return (
    <BannerContext.Provider value={{ variant }}>
      <BannerComponent variant={variant} {...props} />
    </BannerContext.Provider>
  );
};

export const BannerButton = (props) => {
  const { variant } = useContext(BannerContext);
  return <Button variant={variant} {...props} />;
};

export const BannerActionContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
