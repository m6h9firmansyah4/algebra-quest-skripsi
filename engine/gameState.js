export const defaultPlayerStats = {
  name: 'Hero',
  level: 1,
  exp: 0,
  expToNext: 100,
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 5,
  gold: 0
};

export const gameState = {
  screen: 'welcome',
  currentUser: null,

  selectedWorld: null,
  selectedArea: null,
  selectedStage: null,

  learningPhase: null,

  progress: {
    numbers: { done: 0, total: 3 },
    algebra: { done: 0, total: 4 },
    geometry: { done: 0, total: 4 },
    data: { done: 0, total: 3 }
  },

  player: { ...defaultPlayerStats },

  enemy: null,
  currentQuestion: null,
  userAnswer: '',
  feedback: '',
  battleLog: []
};