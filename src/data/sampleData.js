// src/data/sampleData.js

const sampleData = [
    {
      id: 1,
      name: 'Red Dead Redemption 2',
      progress: { completed: 1, total: 2 },
      categories: [
        {
          id: 'c1',
          name: 'Challenges',
          objectives: [
            {
              id: 'o1',
              categoryId: 'c1',
              title: 'Master Hunter 1',
              completed: true,
              tags: [
                { type: 'location', value: 'Valentine' },
                { type: 'difficulty', value: 'Medium' }
              ]
            },
            {
              id: 'o2',
              categoryId: 'c1',
              title: 'Master Hunter 2',
              completed: false,
              notes: 'Need to find boars',
              tags: [
                { type: 'location', value: 'Scarlett Meadows' }
              ]
            }
          ]
        },
        {
          id: 'c2',
          name: 'Story Missions',
          objectives: [
            {
              id: 'o3',
              categoryId: 'c2',
              title: 'Enter Saint Denis',
              completed: true,
              tags: [
                { type: 'location', value: 'Saint Denis' },
                { type: 'story arc', value: 'Main Quest' }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  export default sampleData;
  