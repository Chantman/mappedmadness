export type BrandId = "ocean-in-things" | "motherboard-smoke"

export type AppView =
  | "workspace"
  | "inventory"
  | "completed"
  | "search"
  | "settings"

export type IdeaSort =
  | "best-overall"
  | "simplest"
  | "highest-viral"
  | "most-profitable"
  | "lowest-cost"
  | "shortest-time"
  | "most-parts-owned"
  | "highest-content"
  | "strongest-brand-fit"
  | "most-seasonal"
  | "most-exciting"
  | "recently-added"

export type ProjectStage = "developing" | "in-production" | "completed"

export type DevelopmentStatus =
  | "concept"
  | "research"
  | "feasibility"
  | "parts-planning"

export type ProductionStatus =
  | "planning"
  | "parts-ordered"
  | "ready-to-build"
  | "building"
  | "filming"
  | "editing"

export type InventoryConfidence =
  | "verified"
  | "purchase-inferred"
  | "uncertain"

export type PartCategory =
  | "microcontrollers"
  | "motor-drivers"
  | "motors"
  | "leds"
  | "displays"
  | "filament"

export interface Brand {
  id: BrandId
  name: string
  shortName: string
  descriptor: string
  token: "ocean" | "smoke"
}

export interface RankingScores {
  simplicity: number
  viralPotential: number
  profitability: number
  partsCoverage: number
  contentPotential: number
  brandFit: number
  seasonalUrgency: number
  excitement: number
  readiness: number
}

export interface Idea {
  id: string
  title: string
  concept: string
  brandId: BrandId
  capturedAt: string
  visualId: string
  imageUrl?: string
  scores: RankingScores
  estimatedCost: number
  estimatedHours: number
}

export interface ContentChecklist {
  openingHook: boolean
  designProcess: boolean
  firstFunctionalTest: boolean
  problemsFailures: boolean
  finalReveal: boolean
  longFormExplanation: boolean
}

export interface ProjectDebrief {
  whatWasBuilt: string
  whatChanged: string
  technicalApproach: string
  whatFailed: string
  partsConsumed: string
  actualCost: number
  actualBuildTimeHours: number
  contentPublished: string
  views?: number
  shares?: number
  saves?: number
  followersGained?: number
  inquiries?: number
  revenue?: number
  bestPerformingHook?: string
  whatToRepeat: string
  whatToAvoid: string
  worthBuildingAgain: string
  commercialPotential: string
  additionalNotes: string
  intelligence?: string
}

export interface Project {
  id: string
  title: string
  brandId: BrandId
  stage: ProjectStage
  concept: string
  visualId: string
  imageUrl?: string
  intendedEffect: string
  designDecisions: string
  constraints: string
  toolsAndSkills: string
  partsOwned: string[]
  partsMissing: string[]
  estimatedHours: number
  estimatedCost: number
  developmentStatus?: DevelopmentStatus
  partsCoverage: number
  missingPartsCost: number
  unresolvedQuestion?: string
  productionStatus?: ProductionStatus
  nextPhysicalAction?: string
  blocker?: string
  remainingPartsCost?: number
  targetDate?: string
  checklist?: ContentChecklist
  outcome?: string
  actualCost?: number
  actualBuildTimeHours?: number
  contentPieceCount?: number
  bestResult?: string
  revenueOrInquiries?: string
  lesson?: string
  debrief?: ProjectDebrief
  origin?: Idea
}

export interface InventoryItem {
  id: string
  name: string
  category: PartCategory
  quantity: number
  available: number
  reserved: number
  unit: "pcs" | "g"
  quantityEstimated?: boolean
  location: string
  confidence: InventoryConfidence
  reservedForProjectId?: string
  reservedNote?: string
}

export const emptyChecklist = (): ContentChecklist => ({
  openingHook: false,
  designProcess: false,
  firstFunctionalTest: false,
  problemsFailures: false,
  finalReveal: false,
  longFormExplanation: false,
})

export const emptyDebrief = (): ProjectDebrief => ({
  whatWasBuilt: "",
  whatChanged: "",
  technicalApproach: "",
  whatFailed: "",
  partsConsumed: "",
  actualCost: 0,
  actualBuildTimeHours: 0,
  contentPublished: "",
  whatToRepeat: "",
  whatToAvoid: "",
  worthBuildingAgain: "",
  commercialPotential: "",
  additionalNotes: "",
})
