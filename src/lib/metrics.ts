/**
 * Seeded ideas store simplicity as 1–10 where higher means easier.
 * The UI shows Difficulty as the inverse so existing mock data stays truthful.
 */
export function toDifficulty(simplicity: number) {
  return 11 - simplicity
}

export function toSimplicity(difficulty: number) {
  return 11 - difficulty
}

export function partsOwnedPercent(partsCoverage: number) {
  return partsCoverage * 10
}
