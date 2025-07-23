import styled from 'styled-components';

import { TagRow } from '../sharedStyledComponents';

const Container = styled.ul`
  padding-left: 0;
`;

const TagsList = ({ tags = [] }) => (
  <Container>
    {tags?.map((tag, idx) => (
      <TagRow key={idx} tag={tag}></TagRow>
    ))}
  </Container>
);
export default TagsList;
