import { styled } from 'styled-components';

import { Label } from './Label';
import useAnalytics from '../../services/analyticsService';

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.inputText};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const InputField = ({
  label,
  type = 'text',
  focusActionName,
  blurActionName,
  analyticsMetadata = {},
  ...inputProps
}) => {
  const { logAction } = useAnalytics();

  const handleFocus = () => {
    if (focusActionName) {
      logAction(focusActionName, analyticsMetadata);
    }
  };

  const handleBlur = () => {
    if (blurActionName) {
      logAction(blurActionName, analyticsMetadata);
    }
  };

  return (
    <Label>
      {label}
      <Input type={type} {...inputProps} onFocus={handleFocus} onBlur={handleBlur} />
    </Label>
  );
};
