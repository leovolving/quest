import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ACTION_NAMES } from '../../constants';
import useAnalytics from '../../services/analyticsService';

import { Button, BUTTON_VARIANT, Dialog, InputField } from '../_ds';

import useGameDataService from '../../services/gameDataService';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const NewCategoryForm = ({ isOpen, onClose }) => {
  const { addNewCategory } = useGameDataService();
  const { logAction } = useAnalytics();
  const [categoryName, setCategoryName] = useState('');
  const { gameId } = useParams();

  const analyticsMetadata = { game_id: gameId };

  const handleSuccess = () => {
    logAction(ACTION_NAMES.addNewCategorySuccess, analyticsMetadata);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (categoryName.trim() === '') {
      return;
    }

    addNewCategory(categoryName, { onSuccess: handleSuccess });
  };

  const handleCancel = () => {
    logAction(ACTION_NAMES.addNewCategoryCanceled, analyticsMetadata);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel}>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Add new game</FormTitle>
        <InputField
          label="Quest title"
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Mythic restoration"
          focusActionName={ACTION_NAMES.addNewCategoryTitleFocus}
          blurActionName={ACTION_NAMES.addNewCategoryTitleBlur}
          autoFocus
        />
        <Button type="submit" variant={BUTTON_VARIANT.SECONDARY}>
          Add quest
        </Button>
        <Button type="button" variant={BUTTON_VARIANT.TERTIARY} onClick={handleCancel}>
          Cancel
        </Button>
      </FormContainer>
    </Dialog>
  );
};

export default NewCategoryForm;
