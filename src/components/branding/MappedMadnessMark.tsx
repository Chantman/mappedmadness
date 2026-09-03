import mappedMadnessLogo from "@/assets/mapped-madness-logo.png"

import { cn } from "@/lib/utils"

export function MappedMadnessMark({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <img
      src={mappedMadnessLogo}
      alt={title ?? ""}
      className={cn("object-contain", className)}
      draggable={false}
    />
  )
}

/** Oversized, non-interactive fragment of the workflow route’s loose start. */
export function EmptyStageRoute({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 36"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14 24c-8-2-10-14-2-16 8-2 12 8 8 12-6 6-16-2-8-8"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Tiny completion flourish: a short route ending in an arrow. */
export function CompletionFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 18"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id="completion-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0.6 7.2 4 0 7.4Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d="M2 12.5c8-1.2 14.5-8.2 22.5-6.2 6.2 1.6 10.2 4 16.5 1.2"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        markerEnd="url(#completion-arrow)"
      />
    </svg>
  )
}
