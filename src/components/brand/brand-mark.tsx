import { cn } from "@/lib/utils"

export function BrandMark({
  token,
  className,
}: {
  token: "ocean" | "smoke" | "silver"
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        token === "ocean" && "bg-ocean",
        token === "smoke" && "bg-smoke",
        token === "silver" && "bg-silver",
        className,
      )}
    />
  )
}
