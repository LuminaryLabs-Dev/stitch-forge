function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback;
}

function nearestSupported(value, supportedValues) {
  return supportedValues.reduce((closest, candidate) => {
    return Math.abs(candidate - value) < Math.abs(closest - value) ? candidate : closest;
  }, supportedValues[0]);
}

export function normalizeRetroDaisyInputs(inputState, preset) {
  const warnings = [];
  const constraints = preset.constraints;

  const rawRounds = Number(inputState.rounds);
  const rounds = clamp(Number.isFinite(rawRounds) ? Math.round(rawRounds) : preset.rounds, constraints.minRounds, constraints.maxRounds);
  if (rounds !== rawRounds) {
    warnings.push(`Rounds adjusted to ${rounds} to stay inside the Retro Daisy recipe range.`);
  }

  const rawPetals = Number(inputState.petals);
  const requestedPetals = Number.isFinite(rawPetals) ? Math.round(rawPetals) : preset.petals;
  const petals = nearestSupported(requestedPetals, constraints.supportedPetals);
  if (petals !== requestedPetals) {
    warnings.push(`Petal count adjusted to ${petals}. Retro Daisy is only supported in ${constraints.supportedPetals.join(', ')}-petal layouts.`);
  }

  const normalizedInputs = {
    recipeId: preset.recipeId,
    rounds,
    petals,
    centerColor: normalizeColor(inputState.centerColor, preset.centerColor),
    petalColor: normalizeColor(inputState.petalColor, preset.petalColor),
    borderColor: normalizeColor(inputState.borderColor, preset.borderColor),
    softness: clamp(Number(inputState.softness ?? preset.softness), 0, 1),
    glow: clamp(Number(inputState.glow ?? preset.glow), 0, 1),
    depth: clamp(Number(inputState.depth ?? preset.depth), 0, 1),
  };

  return {
    normalizedInputs,
    warnings,
  };
}
