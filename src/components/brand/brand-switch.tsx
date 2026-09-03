import { brands } from "@/data/catalog"
import type { BrandId } from "@/data/types"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

export function BrandSwitch() {
  const { brandId, setBrandId } = useWorkshop()

  return (
    <div
      role="tablist"
      aria-label="Brand workspace"
      className="brand-switch grid w-[min(100%,420px)] grid-cols-2 gap-0.5 rounded-md p-0.5"
    >
      {brands.map((brand) => {
        const selected = brandId === brand.id
        return (
          <button
            key={brand.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => setBrandId(brand.id as BrandId)}
            className={cn(
              "rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
              selected
                ? brand.token === "ocean"
                  ? "bg-ocean text-primary-foreground"
                  : "bg-smoke text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
            )}
          >
            {brand.name}
          </button>
        )
      })}
    </div>
  )
}
