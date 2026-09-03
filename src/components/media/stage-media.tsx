import { cn } from "@/lib/utils"

export function StageMedia({
  visualId,
  imageUrl,
  label,
  className,
}: {
  visualId: string
  imageUrl?: string
  label: string
  className?: string
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label}
        className={cn("w-full object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn("project-visual w-full", className)}
      data-visual={visualId}
      role="img"
      aria-label={label}
    />
  )
}
