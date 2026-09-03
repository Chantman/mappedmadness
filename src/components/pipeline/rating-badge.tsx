import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const kinds = {
  viral: { emoji: "🔥", label: "Viral potential" },
  difficulty: { emoji: "🧩", label: "Difficulty" },
  parts: { emoji: "🍰", label: "Parts on Hand" },
} as const

export function RatingBadge({
  kind,
  value,
  active,
  className,
}: {
  kind: keyof typeof kinds
  value: string
  active?: boolean
  className?: string
}) {
  const meta = kinds[kind]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn("rating-badge font-rating", className)}
          data-kind={kind}
          data-active={active ? "true" : undefined}
          aria-label={`${meta.label} ${value}`}
        >
          <span aria-hidden="true">{meta.emoji}</span>
          <span>{value}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{meta.label}</TooltipContent>
    </Tooltip>
  )
}
