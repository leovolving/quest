import { useCallback } from 'react';
import styled from 'styled-components';

import { useGameContext } from '../../context/GameContext';

import { InputField } from '../_ds';

const Wrapper = styled.div`
  margin-top: 0.5rem;
`;

export const TagForm = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TagEditor = ({ objective = {}, onUpdateTags, valueInputProps = {} }) => {
  const { locationTagValues, selectedGame } = useGameContext();

  const tagValuesForType = useCallback(
    (typeToMap) => {
      const tagSet = new Set();
      selectedGame?.categories.forEach((cat) => {
        cat.objectives.forEach((obj) => {
          obj.tags?.forEach((tag) => {
            if (tag.type === typeToMap) tagSet.add(tag.value);
          });
        });
      });
      return Array.from(tagSet);
    },
    [selectedGame]
  );

  const handleUpdateTags = (value, idx) => {
    const newTags = [...(objective.tags || [])];
    newTags[idx] = { type: 'Location', value };
    onUpdateTags(newTags);
  };

  const tags = (objective.tags || [])
    .filter((t) => t?.type?.toLowerCase() === 'location')
    .concat({ type: '', value: '' });

  return (
    <Wrapper>
      {tags.map((t, idx) => (
        <TagForm key={`tag-form-${idx}`}>
          <InputField
            list={`tag-values-${idx}`}
            value={t.value}
            onChange={(e) => handleUpdateTags(e.target.value, idx)}
            placeholder="Valentine"
            name={`tag-form-value-${idx}`}
            id={`tag-form-value-${idx}`}
            label={`Location ${idx + 1}`}
            {...valueInputProps}
          />
          <datalist id={`tag-values-${idx}`}>
            {tagValuesForType('Location').map((val, idx) => (
              <option key={idx} value={val} />
            ))}
          </datalist>
        </TagForm>
      ))}
    </Wrapper>
  );
};

export default TagEditor;
