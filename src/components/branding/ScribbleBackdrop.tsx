import { cn } from "@/lib/utils"

export type ScribbleVariant = "sidebar" | "workspace" | "emptyState"

function ScribblePaths({ variant }: { variant: ScribbleVariant }) {
  if (variant === "sidebar") {
    return (
      <svg
        viewBox="0 0 248 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <g className="scribble-blur">
          <path
            className="scribble-stroke scribble-stroke-blue"
            d="M-36 348c52-62 128-28 112 48-14 68-92 62-74-6 16-60 108-18 96 54-12 72-110 86-142 18"
          />
          <path
            className="scribble-stroke scribble-stroke-purple"
            d="M168 790c62-44 118 18 72 78-42 54-128 28-118-32 8-48 78-36 92 18"
          />
        </g>
        <path
          className="scribble-stroke scribble-stroke-turquoise"
          d="M18 528c58-22 108 38 168 12 52-22 78-88 28-102-42-12-62 48-18 68 36 16 92-8 74-54"
        />
        <path
          className="scribble-stroke scribble-stroke-blue"
          d="M196 148c48-38 92 12 58 58-30 40-92 22-78-22 10-32 62-18 70 22"
        />
        <path
          className="scribble-stroke scribble-stroke-turquoise scribble-stroke-soft"
          d="M-10 680c36-8 58 36 98 22 44-16 72-8 64 36"
        />
      </svg>
    )
  }

  if (variant === "emptyState") {
    return (
      <svg
        viewBox="0 0 320 280"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <g className="scribble-blur">
          <path
            className="scribble-stroke scribble-stroke-blue"
            d="M-48 168c64-96 210-118 268 8 48 104-86 148-142 48-40-72 78-92 118-18"
          />
        </g>
        <path
          className="scribble-stroke scribble-stroke-turquoise"
          d="M36 210c48-14 92 28 148 8 40-14 86-6 92 36"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <g className="scribble-blur">
        <path
          className="scribble-stroke scribble-stroke-blue"
          d="M1080-70c210 90 430 40 390 280-40 230-310 170-270-40 28-148 250-90 210 110"
        />
      </g>
      <path
        className="scribble-stroke scribble-stroke-turquoise"
        d="M-90 640c210-48 360 92 620 42 250-48 390-170 620-110"
      />
      <path
        className="scribble-stroke scribble-stroke-blue scribble-stroke-soft"
        d="M980 790c96-62 230-18 188 92"
      />
      <path
        className="scribble-stroke scribble-stroke-turquoise scribble-stroke-soft"
        d="M160 120c70-40 150 8 120 70-24 50-110 28-88-22"
      />
    </svg>
  )
}

export function ScribbleBackdrop({
  variant = "workspace",
  className,
}: {
  variant?: ScribbleVariant
  className?: string
}) {
  return (
    <div
      className={cn("scribble-backdrop", className)}
      data-variant={variant}
      aria-hidden="true"
    >
      <ScribblePaths variant={variant} />
    </div>
  )
}
