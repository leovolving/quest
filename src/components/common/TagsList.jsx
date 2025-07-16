import { TagRow } from '../sharedStyledComponents';

const TagsList = ({ tags = [] }) =>
  tags?.map((tag, idx) => (
    <TagRow key={idx}>
      <span>{tag.type}:</span>
      <strong>{tag.value}</strong>
    </TagRow>
  ));

export default TagsList;
