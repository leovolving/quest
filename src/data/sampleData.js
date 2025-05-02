// src/data/sampleData.js
const sampleData = [
  {
    id: 1,
    name: 'Red Dead Redemption 2',
    status: 'currently-playing',
    progress: { completed: 12, total: 50 },
    categories: [
      {
        id: 'c1',
        name: 'Challenges',
        objectives: [
          { id: 'o1', title: 'Master Hunter 1', completed: true, notes: '', categoryId: 'c1', tags: [{ type: 'location', value: 'Valentine' }] },
          { id: 'o2', title: 'Master Hunter 2', completed: false, notes: 'Need to find boars', categoryId: 'c1', tags: [{ type: 'location', value: 'Saint Denis' }] }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'The Witcher 3',
    status: 'not-played',
    progress: { completed: 0, total: 0 },
    categories: [
    ]
  },
  {
    id: 3,
    name: 'God of War',
    status: 'currently-playing',
    progress: { completed: 0, total: 40 },
    categories: [
      {
        id: 'c3',
        name: 'Quests',
        objectives: [
          { id: 'o5', title: 'Meet the Witch', completed: false, notes: '', categoryId: 'c3' },
          { id: 'o6', title: 'Light of Alfheim', completed: false, notes: '', categoryId: 'c3' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Hollow Knight',
    status: 'beaten-game',
    progress: { completed: 45, total: 45 },
    categories: [
      {
        id: 'c4',
        name: 'Exploration',
        objectives: [
          { id: 'o7', title: 'Crystal Peak', completed: true, notes: '', categoryId: 'c4' },
          { id: 'o8', title: 'Deepnest', completed: true, notes: '', categoryId: 'c4' }
        ]
      }
    ]
  }
];

export default sampleData;
