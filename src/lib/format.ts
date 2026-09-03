import type { InventoryItem } from "@/data/types"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function formatUsd(value: number) {
  return currency.format(value)
}

export function formatHours(hours: number) {
  return `${hours}h`
}

export function formatPercent(value: number) {
  return `${value}%`
}

export function formatAmount(
  value: number,
  item: Pick<InventoryItem, "unit" | "quantityEstimated">,
) {
  const amount = item.quantityEstimated ? `~${value}` : String(value)
  return `${amount} ${item.unit}`
}

export function formatCaptured(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

export function matchesQuery(haystack: string, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return haystack.toLowerCase().includes(needle)
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}
