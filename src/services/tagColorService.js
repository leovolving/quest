import { useGameContext } from '../context/GameContext';

const DEFAULT_TAG_TYPE_CATEGORY_COLORS = [
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#D946EF', // Fuchsia
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#8B5CF6', // Purple
  '#A855F7', // Plum
];

const useTagColorService = () => {
  const { allTagTypes } = useGameContext();

  const tagTypeColorMap = allTagTypes.reduce((acc, curr, idx) => {
    const colorIndex = idx % DEFAULT_TAG_TYPE_CATEGORY_COLORS.length;
    acc[curr] = DEFAULT_TAG_TYPE_CATEGORY_COLORS[colorIndex];
    return acc;
  }, {});

  return { tagTypeColorMap };
};

export default useTagColorService;
