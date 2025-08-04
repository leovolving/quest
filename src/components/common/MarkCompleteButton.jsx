import styled, { css } from 'styled-components';

import { Button, BUTTON_VARIANT } from '../_ds';

import { CircleCheck } from '../../icons';

const ButtonComponent = styled(Button)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: fit-content;

  ${({ theme, isComplete }) => {
    if (isComplete)
      return css`
        background-color: ${theme.banner.success.bg};
        color: ${theme.banner.success.text};
        border-color: ${theme.banner.success.border};

        &:hover {
          background-color: ${theme.banner.success.hover};
        }
      `;
  }}
`;

export const MarkCompleteButton = ({ isComplete, onClick }) => {
  const text = isComplete ? 'Completed' : 'Mark as completed';
  return (
    <ButtonComponent
      isComplete={isComplete}
      onClick={onClick}
      variant={BUTTON_VARIANT.TERTIARY}
      type="button"
    >
      <CircleCheck /> {text}
    </ButtonComponent>
  );
};
