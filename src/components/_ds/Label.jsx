import { styled } from 'styled-components';

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  font-size: 0.85rem;
`;
