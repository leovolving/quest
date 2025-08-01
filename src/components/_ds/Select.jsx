import styled from 'styled-components';

import useAnalytics from '../../services/analyticsService';

import { Label } from './Label';

const Container = styled.div``;

const SelectElement = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  width: 100%;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Option = styled.option``;

export const Select = ({
  id,
  label,
  onChange,
  options,
  value,
  changeActionName,
  analyticsMetadata = {},
}) => {
  const { logAction } = useAnalytics();

  const handleChange = (e) => {
    if (changeActionName) {
      logAction(changeActionName, { ...analyticsMetadata, value: e.target.value });
    }
    onChange(e);
  };

  return (
    <Container>
      <Label htmlFor={id}>{label}</Label>
      <SelectElement id={id} onChange={handleChange} value={value}>
        {options.map((o) => (
          <Option key={o.value} value={o.value}>
            {o.label}
          </Option>
        ))}
      </SelectElement>
    </Container>
  );
};
