import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export function PaperSurface({
  variant = "plain",
  className,
  children,
}: {
  variant?: "plain" | "graph" | "slip"
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn("paper-surface", className)} data-paper={variant}>
      {children}
    </div>
  )
}

export function MarkerSwash({
  tone = "cobalt",
  className,
  children,
}: {
  tone?: "cobalt" | "chartreuse" | "coral"
  className?: string
  children?: ReactNode
}) {
  return (
    <span className={cn("marker-swash", className)} data-tone={tone}>
      {children}
    </span>
  )
}

export function TapeStrip({
  placement = "tl",
  className,
}: {
  placement?: "tl" | "tr" | "bl" | "br" | "pin"
  className?: string
}) {
  return (
    <span
      className={cn("tape-strip", className)}
      data-placement={placement}
      aria-hidden="true"
    />
  )
}

export function RoughCard({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return <div className={cn("rough-card", className)}>{children}</div>
}

export function HandwrittenAnnotation({
  className,
  rotate,
  children,
}: {
  className?: string
  rotate?: number
  children: ReactNode
}) {
  return (
    <p
      className={cn("hand-note", className)}
      style={
        rotate
          ? ({ "--note-rot": `${rotate}deg` } as CSSProperties)
          : undefined
      }
      aria-hidden="true"
    >
      {children}
    </p>
  )
}

export function StampedMetric({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return <span className={cn("stamped-metric", className)}>{children}</span>
}

export function InkStamp({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <span className={cn("ink-stamp", className)} aria-hidden="true">
      {label}
    </span>
  )
}

export function WaveSketch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 120"
      fill="none"
      className={cn("wave-sketch", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 74c18-22 32-48 58-48 22 0 28 22 42 24 16 2 24-26 48-26 22 0 30 20 44 22 18 3 28-20 52-18 14 1 22 12 28 22"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M18 86c16-14 30-8 44-18 16-12 22 6 38 2 18-4 26-22 46-16 16 4 22 16 38 12 14-4 28-18 42-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M36 98c22-8 40 4 62-6 18-8 28 6 46 2 20-4 34-16 54-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M128 28c8 10 6 22-4 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SidebarScribbles({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 248 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("sidebar-scribbles", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M-20 210c48-40 110 8 78 58-28 44-96 18-70-24 20-32 86-8 74 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.22"
      />
      <path
        d="M170 40 188 22M182 44 204 18M196 48 214 28"
        fill="none"
        stroke="#f4eee0"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M20 430c40-28 92 18 140-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  )
}
