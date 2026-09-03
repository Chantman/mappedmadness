import { brandById } from "@/data/catalog"
import type { Project } from "@/data/types"

function lines(title: string, items: string[]) {
  if (items.length === 0) return `${title}: none listed`
  return `${title}:\n${items.map((item) => `- ${item}`).join("\n")}`
}

export function composeDesignPrompt(project: Project) {
  const brand = brandById[project.brandId]
  return [
    `You are helping design a physical product for ${brand.name}.`,
    "",
    `Project: ${project.title}`,
    `Intended effect: ${project.intendedEffect}`,
    `Concept: ${project.concept}`,
    "",
    `Current design decisions: ${project.designDecisions}`,
    `Constraints: ${project.constraints}`,
    `Tools and skills available: ${project.toolsAndSkills}`,
    "",
    lines("Parts already owned", project.partsOwned),
    "",
    lines("Parts believed to be missing", project.partsMissing),
    "",
    `Budget remaining (estimate): $${project.estimatedCost}`,
    `Time remaining (estimate): ${project.estimatedHours} hours`,
    `Unresolved questions: ${project.unresolvedQuestion ?? "None recorded."}`,
    "",
    "Give concrete next design and build decisions.",
    "Prefer specific mechanisms, dimensions, materials, firmware choices and a short build order.",
    "Do not invent a new product. Advance this one.",
  ].join("\n")
}

export function composeImagePrompt(project: Project) {
  const brand = brandById[project.brandId]
  return [
    `Product concept still for ${brand.name}.`,
    `Title: ${project.title}.`,
    project.intendedEffect,
    project.concept,
    `Design notes: ${project.designDecisions}.`,
    "Photographed as a finished physical object on a workbench. No logos, no UI chrome, no watermark.",
  ].join(" ")
}

export function composeDebriefPrompt(project: Project) {
  const brand = brandById[project.brandId]
  const d = project.debrief
  return [
    `Analyze this completed ${brand.name} build as Project Intelligence.`,
    "Use only the notes below. If a figure is labeled sample, treat it as sample.",
    "",
    `Project: ${project.title}`,
    `Original concept: ${project.concept}`,
    "",
    `What was built: ${d?.whatWasBuilt || project.outcome || "Not filled in."}`,
    `What changed: ${d?.whatChanged || "Not filled in."}`,
    `Technical approach: ${d?.technicalApproach || project.designDecisions}`,
    `What failed: ${d?.whatFailed || "Not filled in."}`,
    `Parts consumed: ${d?.partsConsumed || "Not filled in."}`,
    `Actual cost: $${d?.actualCost ?? project.actualCost ?? 0}`,
    `Actual build time: ${d?.actualBuildTimeHours ?? project.actualBuildTimeHours ?? 0} hours`,
    `Content published: ${d?.contentPublished || "Not filled in."}`,
    `Views: ${d?.views ?? "n/a"}`,
    `Shares: ${d?.shares ?? "n/a"}`,
    `Saves: ${d?.saves ?? "n/a"}`,
    `Followers gained: ${d?.followersGained ?? "n/a"}`,
    `Inquiries: ${d?.inquiries ?? "n/a"}`,
    `Revenue: $${d?.revenue ?? 0}`,
    `Best-performing hook: ${d?.bestPerformingHook || project.bestResult || "n/a"}`,
    `Repeat: ${d?.whatToRepeat || project.lesson || "Not filled in."}`,
    `Avoid: ${d?.whatToAvoid || "Not filled in."}`,
    `Build again?: ${d?.worthBuildingAgain || "Not filled in."}`,
    `Commercial potential: ${d?.commercialPotential || "Not filled in."}`,
    `Notes: ${d?.additionalNotes || "None."}`,
    "",
    "Extract:",
    "- Reusable technical knowledge",
    "- Content-performance lessons",
    "- Audience signals",
    "- Commercial opportunities",
    "- Mistakes to avoid",
    "- Follow-up ideas",
    "- Implications for ranking future projects",
  ].join("\n")
}
