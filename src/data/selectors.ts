import type { InventoryItem, Project } from "@/data/types"

export function projectNameById(projects: Project[]) {
  return Object.fromEntries(projects.map((project) => [project.id, project.title]))
}

export function reservedCaption(
  item: InventoryItem,
  names: Record<string, string>,
) {
  if (item.reserved <= 0) return "—"
  if (item.reservedNote) return item.reservedNote
  if (item.reservedForProjectId) {
    return names[item.reservedForProjectId] ?? "Reserved"
  }
  return "Reserved"
}
