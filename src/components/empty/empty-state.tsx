import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  className,
}: {
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3 py-8", className)}>
      <div className="max-w-md">
        <h3 className="text-[18px] font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{body}</p>
      </div>
      {actionLabel && onAction ? (
        <Button className="h-10 text-[15px]" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
