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

const TagEditor = ({ objective = {}, onUpdateTags, typeInputProps = {}, valueInputProps = {} }) => {
  const { allTagTypes, selectedGame } = useGameContext();

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

  const handleUpdateTags = (type, value, idx) => {
    const newTags = [...(objective.tags || [])];
    newTags[idx] = { type, value };
    onUpdateTags(newTags);
  };

  const tags = (objective.tags || []).concat({ type: '', value: '' });

  return (
    <Wrapper>
      {tags.map((t, idx) => (
        <TagForm key={`tag-form-${idx}`}>
          <InputField
            list={`tag-types-${idx}`}
            value={t.type}
            onChange={(e) => handleUpdateTags(e.target.value, t.value, idx)}
            placeholder="Location"
            name={`tag-form-type-${idx}`}
            id={`tag-form-type-${idx}`}
            label="Type"
            {...typeInputProps}
          />
          <datalist id={`tag-types-${idx}`}>
            {allTagTypes.map((type, idx) => (
              <option key={idx} value={type} />
            ))}
          </datalist>

          <InputField
            list={`tag-values-${idx}`}
            value={t.value}
            onChange={(e) => handleUpdateTags(t.type, e.target.value, idx)}
            placeholder="Valentine"
            name={`tag-form-value-${idx}`}
            id={`tag-form-value-${idx}`}
            label="Value"
            {...valueInputProps}
          />
          <datalist id={`tag-values-${idx}`}>
            {tagValuesForType(t.type).map((val, idx) => (
              <option key={idx} value={val} />
            ))}
          </datalist>
        </TagForm>
      ))}
    </Wrapper>
  );
};

export default TagEditor;
