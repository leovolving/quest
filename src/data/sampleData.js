// src/data/sampleData.js
const sampleData = [
    {
      id: 1,
      name: 'Red Dead Redemption 2',
      progress: { completed: 12, total: 50 },
      categories: [
        {
          id: 'c1',
          name: 'Challenges',
          objectives: [
            { id: 'o1', title: 'Master Hunter 1', completed: true, notes: '', categoryId: 'c1' },
            { id: 'o2', title: 'Master Hunter 2', completed: false, notes: 'Need to find boars', categoryId: 'c1' },
          ]
        },
        {
          id: 'c2',
          name: 'Story Missions',
          objectives: [
            { id: 'o3', title: 'Chapter 1: Outlaws from the West', completed: true, categoryId: 'c2' },
            { id: 'o4', title: 'Chapter 2: Enter, Pursued by a Memory', completed: false, categoryId: 'c2' },
          ]
        }
      ]
    }
  ];
  
  export default sampleData;
  