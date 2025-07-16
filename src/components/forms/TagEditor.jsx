// src/components/TagEditor.jsx
import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { TagRow } from '../sharedStyledComponents';

import { useGameContext } from '../../context/GameContext';
import TagsList from '../common/TagsList';

const Wrapper = styled.div`
  margin-top: 0.5rem;
`;

const Input = styled.input`
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const TagEditor = ({ objective = {}, onUpdateTags }) => {
  const { games, selectedGame } = useGameContext();
  const [newType, setNewType] = useState('');
  const [newValue, setNewValue] = useState('');

  const allTagTypes = useMemo(() => {
    const tagSet = new Set();
    games.forEach((game) => {
      game.categories.forEach((cat) => {
        cat.objectives.forEach((obj) => {
          obj.tags?.forEach((tag) => tagSet.add(tag.type));
        });
      });
    });
    return Array.from(tagSet);
  }, [games]);

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
      <TagRow>
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

        <Button type="button" onClick={handleAddTag}>
          Add Tag
        </Button>
      </TagRow>
    </Wrapper>
  );
};

export default TagEditor;
