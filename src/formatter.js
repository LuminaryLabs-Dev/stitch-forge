function formatSummary(summary) {
  return [
    `${summary.rounds} rounds`,
    `${summary.petals} petals`,
    `${summary.totalStitches} total stitches`,
  ];
}

export function formatPattern(artifact) {
  const summaryChips = formatSummary(artifact.summary);
  const rounds = artifact.rounds.map((round) => ({
    index: round.index,
    title: round.title,
    countLabel: round.countLabel,
    role: round.role,
    instruction: round.instruction,
  }));

  const exportLines = [
    artifact.name,
    `Finished size: ${artifact.summary.finishedSize}`,
    `Summary: ${summaryChips.join(' | ')}`,
    `Materials: ${artifact.materials.join(' | ')}`,
    `Abbreviations: ${artifact.abbreviations.join(' | ')}`,
    `Notes: ${artifact.notes.join(' | ')}`,
  ];

  if (artifact.warnings.length > 0) {
    exportLines.push(`Recipe notes: ${artifact.warnings.join(' | ')}`);
  }

  artifact.rounds.forEach((round) => {
    exportLines.push(`Round ${round.index} - ${round.title} (${round.countLabel}): ${round.instruction}`);
  });

  return {
    summaryChips,
    rounds,
    abbreviationsLine: artifact.abbreviations.join(' | '),
    exportText: exportLines.join('\n'),
  };
}
