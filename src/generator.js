import { formatPattern } from './formatter.js';
import { buildRetroDaisyPattern } from './pattern-model.js';
import { PRESETS } from './presets.js';
import { normalizeRetroDaisyInputs } from './validation.js';

export function generatePattern(inputState) {
  const preset = PRESETS.retroDaisy;
  const validation = normalizeRetroDaisyInputs(inputState, preset);
  const artifact = buildRetroDaisyPattern({
    preset,
    rawInputs: inputState,
    normalizedInputs: validation.normalizedInputs,
    warnings: validation.warnings,
  });

  return {
    ...artifact,
    formatted: formatPattern(artifact),
  };
}
