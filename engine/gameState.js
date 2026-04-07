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

  settings: {
  sound: true,
  music: true,
  theme: "default",
  musicTrack: "default"
},

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
  skills: [
  { name: "Basic Attack", power: 1 }
  ],

  achievements: [
    { name: "Pemula", bonus: 0 },
    { name: "Pejuang", bonus: 2 },
    { name: "Master", bonus: 5 }
  ],

  title: "Pemula",
  enemy: null,
  currentQuestion: null,
  userAnswer: '',
  feedback: '',
  battleLog: []
};