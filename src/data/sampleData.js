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
          {
            id: 'o1',
            title: 'Win 5 hands of poker',
            completed: true,
            notes: 'Gambler 1',
            categoryId: 'c1',
            progress: { current: 1, total: 5 },
            tags: [
              { type: 'Activity', value: 'Gambling' },
              { type: 'Location', value: 'Valentine' },
              { type: 'Location', value: 'Saint Denis' },
              { type: 'Location', value: 'Flatneck Station' },
            ],
          },
          {
            id: 'o2',
            title: 'Pick and Eat Four Species of Berry',
            completed: false,
            notes: 'Herbalist 2 - Not sure what the 4th berry is supposed to be',
            progress: { current: 3, total: 4 },
            categoryId: 'c1',
            tags: [{ type: 'Activity', value: 'foraging' }],
          },
        ],
      },
      {
        id: 'c1',
        name: 'Collectibles',
        objectives: [
          {
            id: 'o11123',
            title: 'Dinosaur bones',
            completed: false,
            notes: 'Near the giant bones\n\nSome are locked until the epilogue',
            categoryId: 'c1',
            progress: { current: 15, total: 23 },
            tags: [
              { type: 'Activity', value: 'Collecting' },
              { type: 'Location', value: 'Blackwater' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'The Witcher 3',
    status: 'not-played',
    progress: { completed: 0, total: 0 },
    categories: [],
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
          {
            id: 'o5',
            title: 'Meet the Witch',
            completed: true,
            notes: '',
            categoryId: 'c3',
            tags: [{ type: 'Realm', value: 'Midguard' }],
          },
          {
            id: 'o6',
            title: 'Light of Alfheim',
            completed: false,
            notes: '',
            categoryId: 'c3',
            tags: [{ type: 'Realm', value: 'Alfheim' }],
          },
        ],
      },
    ],
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
          { id: 'o8', title: 'Deepnest', completed: true, notes: '', categoryId: 'c4' },
        ],
      },
    ],
  },
];

export default sampleData;
