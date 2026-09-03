import type {
  Brand,
  BrandId,
  DevelopmentStatus,
  IdeaSort,
  InventoryConfidence,
  PartCategory,
  ProductionStatus,
  ProjectStage,
} from "@/data/types"

const ocean: Brand = {
  id: "ocean-in-things",
  name: "Ocean in Things",
  shortName: "Ocean",
  descriptor: "Physical objects that contain the sea",
  token: "ocean",
}

const smoke: Brand = {
  id: "motherboard-smoke",
  name: "Motherboard Smoke",
  shortName: "Smoke",
  descriptor: "Machines, cases, and electrical theater",
  token: "smoke",
}

export const brands: Brand[] = [ocean, smoke]

export const brandById: Record<BrandId, Brand> = {
  "ocean-in-things": ocean,
  "motherboard-smoke": smoke,
}

export const ideaSortCopy: Record<IdeaSort, string> = {
  "best-overall": "✨ Best overall",
  simplest: "🧩 Lowest difficulty",
  "highest-viral": "🔥 Viral potential",
  "most-profitable": "💰 Profit potential",
  "lowest-cost": "💵 Lowest estimated cost",
  "shortest-time": "⏱ Shortest build",
  "most-parts-owned": "🍰 Parts on Hand",
  "highest-content": "🎥 Content potential",
  "strongest-brand-fit": "🎯 Strongest brand fit",
  "most-seasonal": "📅 Seasonal urgency",
  "most-exciting": "❤️ Most exciting",
  "recently-added": "🆕 Recently added",
}

export const developmentCopy: Record<DevelopmentStatus, string> = {
  concept: "Concept",
  research: "Research",
  feasibility: "Feasibility",
  "parts-planning": "Parts planning",
}

export const productionCopy: Record<ProductionStatus, string> = {
  planning: "Planning",
  "parts-ordered": "Parts Ordered",
  "ready-to-build": "Ready to Build",
  building: "Building",
  filming: "Filming",
  editing: "Editing",
}

export const stageCopy: Record<ProjectStage, string> = {
  developing: "Developing",
  "in-production": "In Production",
  completed: "Completed",
}

export const confidenceCopy: Record<InventoryConfidence, string> = {
  verified: "Verified",
  "purchase-inferred": "Purchase inferred",
  uncertain: "Uncertain",
}

export const categoryCopy: Record<PartCategory, string> = {
  microcontrollers: "Microcontrollers",
  "motor-drivers": "Motor Drivers",
  motors: "Motors",
  leds: "LEDs",
  displays: "Displays",
  filament: "3D-printing supplies",
}

export const confidenceToneClass: Record<InventoryConfidence, string> = {
  verified: "bg-verified",
  "purchase-inferred": "bg-inferred",
  uncertain: "bg-uncertain",
}

export const laneCopy = {
  ideas: { title: "Raw Ideas", phrase: "Rank and select" },
  developing: { title: "Developing", phrase: "Design and solve" },
  production: { title: "In Production", phrase: "Build and capture" },
  completed: { title: "Completed", phrase: "Results and lessons" },
} as const

export const checklistCopy = {
  openingHook: "Opening hook",
  designProcess: "Design/process footage",
  firstFunctionalTest: "First functional test",
  problemsFailures: "Problems/failures",
  finalReveal: "Final reveal",
  longFormExplanation: "Long-form explanation",
} as const
