import { useGameContext } from '../context/GameContext';

const DEFAULT_TAG_TYPE_CATEGORY_COLORS = [
  { bg: '#8B4513', text: '#FFFFFF' },
  { bg: '#9fd824', text: '#1A1A1A' },
  { bg: '#3f388f', text: '#FFFFFF' },
  { bg: '#f2be85', text: '#1A1A1A' },
  { bg: '#1dbce6', text: '#1A1A1A' },
  { bg: '#aed0d4', text: '#1A1A1A' },
  { bg: '#1a33da', text: '#FFFFFF' },
  { bg: '#b5e1b6', text: '#1A1A1A' },
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
