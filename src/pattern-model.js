function buildRoundBands(roundCount) {
  const bands = [];
  bands.push({ inner: 0.0, outer: 0.17, squareMix: 0.0 });
  bands.push({ inner: 0.17, outer: 0.38, squareMix: 0.15 });

  const outerBandCount = Math.max(roundCount - 2, 1);
  const outerStart = 0.38;
  const outerEnd = 0.9;
  const step = (outerEnd - outerStart) / outerBandCount;

  for (let index = 0; index < outerBandCount; index += 1) {
    const inner = outerStart + step * index;
    const outer = outerStart + step * (index + 1);
    const squareMix = 0.35 + (0.65 * index) / Math.max(outerBandCount - 1, 1);
    bands.push({ inner, outer, squareMix });
  }

  return bands.slice(0, roundCount);
}

function createRound({
  index,
  role,
  title,
  colorRole,
  colorValue,
  repeatCount,
  groups,
  cornerCount,
  stitchCount,
  countLabel,
  instruction,
  renderBand,
}) {
  return {
    index,
    role,
    title,
    colorRole,
    colorValue,
    repeatCount,
    groups,
    cornerCount,
    stitchCount,
    countLabel,
    instruction,
    renderBand,
  };
}

function buildSquareInstruction(sideClusters, sourceLabel) {
  if (sideClusters <= 0) {
    return `[(3 dc, ch 2, 3 dc) in next ${sourceLabel}] repeat 4 times to turn the flower into a square.`;
  }

  return `[(3 dc, ch 2, 3 dc) in next ${sourceLabel}, 3 dc in each of next ${sideClusters} ${sourceLabel === 'petal ch-2 sp' ? 'petal ch-2 sps' : 'side spaces'}] repeat 4 times.`;
}

function buildExpansionInstruction(sideClusters) {
  return `[(3 dc, ch 2, 3 dc) in corner sp, 3 dc in each of next ${sideClusters} side spaces] repeat 4 times.`;
}

export function buildRetroDaisyPattern({ preset, rawInputs, normalizedInputs, warnings }) {
  const { rounds: roundCount, petals } = normalizedInputs;
  const petalsPerSide = petals / 4;
  const roundBands = buildRoundBands(roundCount);
  const rounds = [];

  rounds.push(
    createRound({
      index: 1,
      role: 'center',
      title: 'Center Ring',
      colorRole: 'center',
      colorValue: normalizedInputs.centerColor,
      repeatCount: 1,
      groups: [
        {
          label: 'ring anchors',
          repeat: 1,
          stitches: [{ type: 'sc', count: petals }],
        },
      ],
      cornerCount: 0,
      stitchCount: petals,
      countLabel: `${petals} SC`,
      instruction: `With center color, MR, ch 1, work ${petals} sc into ring, sl st to first sc.`,
      renderBand: roundBands[0],
    }),
  );

  rounds.push(
    createRound({
      index: 2,
      role: 'petals',
      title: 'Petal Round',
      colorRole: 'petals',
      colorValue: normalizedInputs.petalColor,
      repeatCount: petals,
      groups: [
        {
          label: 'petal shell',
          repeat: petals,
          stitches: [
            { type: 'slst', count: 1 },
            { type: 'ch', count: 2 },
            { type: 'dc', count: 3 },
            { type: 'ch', count: 2 },
          ],
        },
      ],
      cornerCount: 0,
      stitchCount: petals * 4,
      countLabel: `${petals} petals / ${petals * 3} DC`,
      instruction: `Join petal color in any sc. [Sl st in next st, ch 2, 3 dc in same st, ch 2] repeat around to form ${petals} petals.`,
      renderBand: roundBands[1],
    }),
  );

  const squareSideClusters = petalsPerSide - 1;
  const round3Role = roundCount === 3 ? 'border' : 'square-base';
  rounds.push(
    createRound({
      index: 3,
      role: round3Role,
      title: roundCount === 3 ? 'Square and Border Round' : 'Squaring Round',
      colorRole: 'border',
      colorValue: normalizedInputs.borderColor,
      repeatCount: 4,
      groups: [
        {
          label: 'corner block',
          repeat: 4,
          stitches: [
            { type: 'dc', count: 6 },
            { type: 'ch', count: 2 },
          ],
        },
        {
          label: 'side block',
          repeat: Math.max(squareSideClusters * 4, 0),
          stitches: [{ type: 'dc', count: 3 }],
        },
      ],
      cornerCount: 4,
      stitchCount: 24 + Math.max(squareSideClusters, 0) * 12,
      countLabel: `${24 + Math.max(squareSideClusters, 0) * 12} DC / 4 corners`,
      instruction: `Join border color in any petal ch-2 sp. ${buildSquareInstruction(squareSideClusters, 'petal ch-2 sp')}`,
      renderBand: roundBands[2],
    }),
  );

  for (let index = 4; index <= roundCount; index += 1) {
    const sideClusters = petalsPerSide + index - 4;
    const isBorder = index === roundCount;

    rounds.push(
      createRound({
        index,
        role: isBorder ? 'border' : 'expansion',
        title: isBorder ? 'Border Round' : `Expansion Round ${index - 3}`,
        colorRole: 'border',
        colorValue: normalizedInputs.borderColor,
        repeatCount: 4,
        groups: [
          {
            label: 'corner block',
            repeat: 4,
            stitches: [
              { type: 'dc', count: 6 },
              { type: 'ch', count: 2 },
            ],
          },
          {
            label: 'side block',
            repeat: sideClusters * 4,
            stitches: [{ type: 'dc', count: 3 }],
          },
        ],
        cornerCount: 4,
        stitchCount: 24 + sideClusters * 12,
        countLabel: `${24 + sideClusters * 12} DC / 4 corners`,
        instruction: isBorder
          ? `${buildExpansionInstruction(sideClusters)} Fasten off after the final corner join.`
          : buildExpansionInstruction(sideClusters),
        renderBand: roundBands[index - 1],
      }),
    );
  }

  const totalStitches = rounds.reduce((sum, round) => sum + round.stitchCount, 0);
  const sizeInches = (3.25 + roundCount * 1.35).toFixed(1);
  const sizeCm = (Number(sizeInches) * 2.54).toFixed(1);

  return {
    recipeId: preset.recipeId,
    name: preset.exportTitle,
    presetName: preset.name,
    rawInputs,
    normalizedInputs,
    warnings,
    rounds,
    abbreviations: [
      'MR = magic ring',
      'SC = single crochet',
      'DC = double crochet',
      'SL ST = slip stitch',
      'SP = space',
    ],
    materials: [
      'Worsted-weight cotton or acrylic yarn',
      '4.0 mm / G-6 hook',
      'Tapestry needle',
      'Scissors',
    ],
    notes: [
      `Center color: ${normalizedInputs.centerColor}`,
      `Petal color: ${normalizedInputs.petalColor}`,
      `Border color: ${normalizedInputs.borderColor}`,
    ],
    summary: {
      rounds: roundCount,
      petals,
      petalsPerSide,
      totalStitches,
      finishedSize: `${sizeInches} in / ${sizeCm} cm approx.`,
    },
    render: {
      centerRadius: roundBands[0].outer,
      petalInner: roundBands[1].inner,
      petalOuter: roundBands[1].outer,
      squareStart: roundBands[Math.min(2, roundBands.length - 1)].inner,
      squareEnd: roundBands[roundBands.length - 1].outer,
      borderInner: roundBands[roundBands.length - 1].inner,
      borderOuter: roundBands[roundBands.length - 1].outer,
      bandWidth:
        roundBands.length > 2
          ? roundBands[roundBands.length - 1].outer - roundBands[Math.min(2, roundBands.length - 1)].inner
          : roundBands[roundBands.length - 1].outer - roundBands[0].inner,
      sideClusters: petalsPerSide + Math.max(roundCount - 4, 0),
      roundBands,
    },
  };
}
