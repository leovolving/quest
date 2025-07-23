// src/components/TagEditor.jsx
import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../components/_ds';

import { useGameContext } from '../../context/GameContext';
import TagsList from '../common/TagsList';

const Wrapper = styled.div`
  margin-top: 0.5rem;
`;

export const TagForm = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
`;

const TagEditor = ({ objective = {}, onUpdateTags }) => {
  const { allTagTypes, selectedGame } = useGameContext();
  const [newType, setNewType] = useState('');
  const [newValue, setNewValue] = useState('');

  const tagValuesForType = useMemo(() => {
    const tagSet = new Set();
    selectedGame?.categories.forEach((cat) => {
      cat.objectives.forEach((obj) => {
        obj.tags?.forEach((tag) => {
          if (tag.type === newType) tagSet.add(tag.value);
        });
      });
    });
    return Array.from(tagSet);
  }, [selectedGame, newType]);

  const handleAddTag = () => {
    if (!newType || !newValue) return;
    const newTags = [...(objective.tags || []), { type: newType, value: newValue }];
    onUpdateTags(newTags);
    setNewType('');
    setNewValue('');
  };

  return (
    <Wrapper>
      <TagsList tags={objective.tags} />
      <TagForm>
        <Input
          list="tag-types"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Tag type"
        />
        <datalist id="tag-types">
          {allTagTypes.map((type, idx) => (
            <option key={idx} value={type} />
          ))}
        </datalist>

        <Input
          list="tag-values"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Tag value"
        />
        <datalist id="tag-values">
          {tagValuesForType.map((val, idx) => (
            <option key={idx} value={val} />
          ))}
        </datalist>

        <Button variant="tertiary" onClick={handleAddTag}>
          Add Tag
        </Button>
      </TagForm>
    </Wrapper>
  );
};

export default TagEditor;
