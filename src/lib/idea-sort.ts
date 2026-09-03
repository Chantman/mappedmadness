import { ideaSortCopy } from "@/data/catalog"
import type { Idea, IdeaSort, RankingScores } from "@/data/types"
import { partsOwnedPercent, toDifficulty } from "@/lib/metrics"

export const IDEA_SORTS = Object.keys(ideaSortCopy) as IdeaSort[]

export function averageScore(scores: RankingScores) {
  const values = Object.values(scores)
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

function compareTitle(a: Idea, b: Idea) {
  return a.title.localeCompare(b.title) || a.id.localeCompare(b.id)
}

/**
 * Deterministic idea ranking. Manual 1–10 scores plus cost/hours.
 * No model is involved; ties break on title, then id.
 */
export function sortIdeas(ideas: Idea[], method: IdeaSort): Idea[] {
  const ranked = [...ideas]

  ranked.sort((a, b) => {
    let delta = 0

    switch (method) {
      case "best-overall":
        delta = averageScore(b.scores) - averageScore(a.scores)
        break
      case "simplest":
        delta =
          b.scores.simplicity - a.scores.simplicity ||
          a.estimatedHours - b.estimatedHours
        break
      case "highest-viral":
        delta = b.scores.viralPotential - a.scores.viralPotential
        break
      case "most-profitable":
        delta = b.scores.profitability - a.scores.profitability
        break
      case "lowest-cost":
        delta = a.estimatedCost - b.estimatedCost
        break
      case "shortest-time":
        delta = a.estimatedHours - b.estimatedHours
        break
      case "most-parts-owned":
        delta = b.scores.partsCoverage - a.scores.partsCoverage
        break
      case "highest-content":
        delta = b.scores.contentPotential - a.scores.contentPotential
        break
      case "strongest-brand-fit":
        delta = b.scores.brandFit - a.scores.brandFit
        break
      case "most-seasonal":
        delta = b.scores.seasonalUrgency - a.scores.seasonalUrgency
        break
      case "most-exciting":
        delta = b.scores.excitement - a.scores.excitement
        break
      case "recently-added":
        delta =
          new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
        break
    }

    if (delta !== 0) return delta
    return compareTitle(a, b)
  })

  return ranked
}

export function sortDisplay(method: IdeaSort, idea: Idea) {
  switch (method) {
    case "best-overall":
      return {
        value: averageScore(idea.scores).toFixed(1),
        unit: "OVERALL",
        meter: averageScore(idea.scores) / 10,
      }
    case "simplest":
      return {
        value: toDifficulty(idea.scores.simplicity).toFixed(1),
        unit: "DIFFICULTY",
        meter: toDifficulty(idea.scores.simplicity) / 10,
      }
    case "highest-viral":
      return {
        value: idea.scores.viralPotential.toFixed(1),
        unit: "VIRAL",
        meter: idea.scores.viralPotential / 10,
      }
    case "most-profitable":
      return {
        value: idea.scores.profitability.toFixed(1),
        unit: "PROFIT",
        meter: idea.scores.profitability / 10,
      }
    case "lowest-cost":
      return {
        value: `$${idea.estimatedCost}`,
        unit: "COST",
        meter: null,
      }
    case "shortest-time":
      return {
        value: `${idea.estimatedHours}h`,
        unit: "TIME",
        meter: null,
      }
    case "most-parts-owned":
      return {
        value: `${partsOwnedPercent(idea.scores.partsCoverage)}%`,
        unit: "ON HAND",
        meter: idea.scores.partsCoverage / 10,
      }
    case "highest-content":
      return {
        value: idea.scores.contentPotential.toFixed(1),
        unit: "CONTENT",
        meter: idea.scores.contentPotential / 10,
      }
    case "strongest-brand-fit":
      return {
        value: idea.scores.brandFit.toFixed(1),
        unit: "FIT",
        meter: idea.scores.brandFit / 10,
      }
    case "most-seasonal":
      return {
        value: idea.scores.seasonalUrgency.toFixed(1),
        unit: "SEASON",
        meter: idea.scores.seasonalUrgency / 10,
      }
    case "most-exciting":
      return {
        value: idea.scores.excitement.toFixed(1),
        unit: "SPARK",
        meter: idea.scores.excitement / 10,
      }
    case "recently-added":
      return {
        value: new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
        }).format(new Date(idea.capturedAt)),
        unit: "ADDED",
        meter: null,
      }
  }
}
