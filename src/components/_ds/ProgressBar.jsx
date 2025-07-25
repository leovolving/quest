import { styled } from 'styled-components';

const Progress = styled.progress`
  width: 100%;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.border};

  &::-webkit-progress-bar {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &::-webkit-progress-value {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const ProgressBar = ({ value, max }) => <Progress value={value} max={max} />;
