export const PRESETS = {
  retroDaisy: {
    id: 'retroDaisy',
    recipeId: 'retro-daisy',
    name: 'Retro Daisy',
    exportTitle: 'Retro Daisy Granny Square',
    rounds: 5,
    petals: 8,
    centerColor: '#f4d35e',
    petalColor: '#f28f3b',
    borderColor: '#5b3a29',
    softness: 0.7,
    glow: 0.45,
    depth: 0.55,
    constraints: {
      minRounds: 3,
      maxRounds: 8,
      supportedPetals: [4, 8, 12, 16],
    },
  },
};

export function clonePreset(preset) {
  return structuredClone(preset);
}
