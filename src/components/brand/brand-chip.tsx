import { BrandMark } from "@/components/brand/brand-mark"
import { brandById } from "@/data/catalog"
import type { BrandId } from "@/data/types"
import { cn } from "@/lib/utils"

export function BrandChip({
  brandId,
  className,
}: {
  brandId: BrandId
  className?: string
}) {
  const brand = brandById[brandId]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] text-muted-foreground",
        className,
      )}
    >
      <BrandMark token={brand.token} />
      {brand.name}
    </span>
  )
}
