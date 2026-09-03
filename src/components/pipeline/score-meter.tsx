import { cn } from "@/lib/utils"

export function ScoreMeter({
  value,
  segments = 5,
  className,
}: {
  value: number
  segments?: number
  className?: string
}) {
  const filled = Math.round(Math.min(1, Math.max(0, value)) * segments)

  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex items-center gap-px", className)}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-[9px] w-[3px]",
            index < filled ? "bg-current" : "bg-foreground/12",
          )}
        />
      ))}
    </span>
  )
}
