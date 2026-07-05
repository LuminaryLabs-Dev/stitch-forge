import assert from 'node:assert/strict';

import { generatePattern } from '../src/generator.js';

const scenarios = [
  { name: 'default', input: { rounds: 5, petals: 8, centerColor: '#f4d35e', petalColor: '#f28f3b', borderColor: '#5b3a29', softness: 0.7, glow: 0.45, depth: 0.55 } },
  { name: 'minimum-rounds', input: { rounds: 3, petals: 4, centerColor: '#f4d35e', petalColor: '#f28f3b', borderColor: '#5b3a29', softness: 0.4, glow: 0.25, depth: 0.4 } },
  { name: 'maximum-rounds', input: { rounds: 8, petals: 16, centerColor: '#f4d35e', petalColor: '#f28f3b', borderColor: '#5b3a29', softness: 0.9, glow: 0.6, depth: 0.7 } },
  { name: 'normalized-petals', input: { rounds: 6, petals: 10, centerColor: '#f4d35e', petalColor: '#f28f3b', borderColor: '#5b3a29', softness: 0.5, glow: 0.35, depth: 0.5 } },
];

for (const scenario of scenarios) {
  const artifact = generatePattern(scenario.input);

  assert.equal(artifact.rounds.length, artifact.summary.rounds, `${scenario.name}: round count mismatch`);
  assert.equal(artifact.formatted.rounds.length, artifact.rounds.length, `${scenario.name}: formatted round count mismatch`);
  assert.equal(artifact.normalizedInputs.petals % 4, 0, `${scenario.name}: petals not normalized to a square-friendly count`);
  assert.ok(artifact.summary.totalStitches > 0, `${scenario.name}: missing stitch totals`);
  assert.ok(artifact.formatted.exportText.includes('Round 1'), `${scenario.name}: export text missing round data`);
  assert.ok(artifact.render.borderInner < artifact.render.borderOuter, `${scenario.name}: invalid border band`);
}

console.log(`Validated ${scenarios.length} Retro Daisy scenarios.`);
