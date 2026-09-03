import type { ReactNode } from "react"

import { ScribbleBackdrop } from "@/components/branding/ScribbleBackdrop"
import { HandwrittenAnnotation, InkStamp } from "@/components/studio/primitives"

export function PipelineColumn({
  stage,
  count,
  flash,
  warning,
  toolbar,
  empty,
  children,
}: {
  stage: "ideas" | "developing" | "production" | "completed"
  count: number
  flash?: boolean
  warning?: string
  toolbar?: ReactNode
  empty?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      className="pipeline-lane"
      data-stage={stage}
      data-flash={flash ? "true" : undefined}
    >
      {stage === "ideas" ? null : (
        <ScribbleBackdrop variant="workspace" />
      )}
      {toolbar}
      {warning ? (
        <p className="border-b border-border px-3 py-1.5 text-[12px] text-blocked">
          {warning}
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {count === 0 ? empty : children}
        {stage === "production" && count > 0 ? (
          <div className="relative mt-auto min-h-[8rem] px-3 py-6">
            <InkStamp className="lane-stamp" label="Ocean in Things" />
            <HandwrittenAnnotation className="lane-slogan" rotate={-7}>
              DEPTH DRIVES DESIGN.
            </HandwrittenAnnotation>
          </div>
        ) : null}
      </div>
    </section>
  )
}
