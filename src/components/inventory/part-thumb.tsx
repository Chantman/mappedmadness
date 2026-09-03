import { Cpu, Lightbulb, Monitor, Package, RotateCw, Zap } from "lucide-react"

import type { PartCategory } from "@/data/types"

const icons = {
  microcontrollers: Cpu,
  "motor-drivers": Zap,
  motors: RotateCw,
  leds: Lightbulb,
  displays: Monitor,
  filament: Package,
} as const

export function PartThumb({ category }: { category: PartCategory }) {
  const Icon = icons[category]

  return (
    <span className="part-thumb">
      {Icon ? <Icon className="size-3.5" strokeWidth={1.5} /> : null}
    </span>
  )
}
