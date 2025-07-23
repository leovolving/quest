import styled from 'styled-components';

import { darken } from '../../utils/colors';
import useTagColorService from '../../services/tagColorService';

const Container = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${({ bg }) => bg};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${({ bg }) => darken(0.15, bg)};
`;

export const TagRow = ({ tag }) => {
  const { tagTypeColorMap } = useTagColorService();
  const backgroundColor = tagTypeColorMap[tag.type];
  return (
    <Container bg={backgroundColor}>
      <span>{tag.type}:</span>
      <strong>{tag.value}</strong>
    </Container>
  );
};
