import { confidenceCopy, confidenceToneClass } from "@/data/catalog"
import type { InventoryConfidence } from "@/data/types"
import { cn } from "@/lib/utils"

export function ConfidenceMark({
  confidence,
  className,
}: {
  confidence: InventoryConfidence
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          confidenceToneClass[confidence],
        )}
      />
      {confidenceCopy[confidence]}
    </span>
  )
}
