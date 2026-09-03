import { useLayoutEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import { CardMenu } from "@/components/actions/card-menu"
import { RatingBadge } from "@/components/pipeline/rating-badge"
import { Button } from "@/components/ui/button"
import type { Idea, IdeaSort } from "@/data/types"
import { copyText, formatHours, formatUsd } from "@/lib/format"
import { partsOwnedPercent, toDifficulty } from "@/lib/metrics"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

const extraScores: { key: keyof Idea["scores"]; label: string }[] = [
  { key: "profitability", label: "Profit" },
  { key: "contentPotential", label: "Content" },
  { key: "brandFit", label: "Brand fit" },
  { key: "seasonalUrgency", label: "Seasonal" },
  { key: "excitement", label: "Excitement" },
  { key: "readiness", label: "Readiness" },
]

function sortKind(sort: IdeaSort): "viral" | "difficulty" | "parts" | null {
  if (sort === "highest-viral") return "viral"
  if (sort === "simplest") return "difficulty"
  if (sort === "most-parts-owned") return "parts"
  return null
}

export function IdeaRow({
  idea,
  rank,
  leaving,
  expanded,
  onToggle,
  onEdit,
  onPromote,
}: {
  idea: Idea
  rank: number
  leaving?: boolean
  expanded?: boolean
  onToggle: () => void
  onEdit: () => void
  onPromote: () => void
}) {
  const { ideaSort, openCapture } = useWorkshop()
  const active = sortKind(ideaSort)
  const conceptRef = useRef<HTMLParagraphElement>(null)
  const [overflows, setOverflows] = useState(false)

  useLayoutEffect(() => {
    const node = conceptRef.current
    if (!node || expanded) return
    setOverflows(node.scrollHeight > node.clientHeight + 1)
  }, [idea.concept, expanded])

  return (
    <article
      data-leaving={leaving ? "true" : undefined}
      data-expanded={expanded ? "true" : undefined}
      className="idea-row"
      onClick={onToggle}
    >
      <button
        type="button"
        className="col-span-2 grid grid-cols-[36px_minmax(0,1fr)] items-start gap-x-0 text-left"
        aria-expanded={expanded}
      >
        <span className="font-heading pt-1 text-[13px] text-muted-foreground">
          {String(rank).padStart(2, "0")}
        </span>
        <span className="idea-copy">
          <span className="font-heading block text-[16px] leading-5">
            {idea.title}
          </span>
          <p
            ref={conceptRef}
            className={cn(
              "mt-1 text-[13px] leading-5 text-muted-foreground",
              expanded ? "whitespace-pre-wrap" : "line-clamp-3",
            )}
          >
            {idea.concept}
          </p>
          {!expanded && overflows ? (
            <span className="mt-1 inline-block text-[12px] font-semibold text-purple">
              more
            </span>
          ) : null}
        </span>
      </button>
      <div className="idea-ratings pt-0.5">
        <RatingBadge
          kind="viral"
          value={idea.scores.viralPotential.toFixed(1)}
          active={active === "viral"}
        />
        <RatingBadge
          kind="difficulty"
          value={toDifficulty(idea.scores.simplicity).toFixed(1)}
          active={active === "difficulty"}
        />
        <RatingBadge
          kind="parts"
          value={`${partsOwnedPercent(idea.scores.partsCoverage)}%`}
          active={active === "parts"}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        className="mt-1 text-muted-foreground"
        aria-label={expanded ? `Collapse ${idea.title}` : `Expand ${idea.title}`}
      >
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </Button>
      <div
        className="mt-1"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <CardMenu
          label={`${idea.title} actions`}
          items={[
            { label: "Edit details", onSelect: onEdit },
            {
              label: "Copy title",
              onSelect: () => {
                void copyText(idea.title)
              },
            },
            {
              label: "Catch a related note",
              onSelect: () => openCapture(`${idea.title}: `),
            },
            { label: "Promote to Developing", onSelect: onPromote },
          ]}
        />
      </div>
      <div className="idea-expand">
        <div className="idea-expand-inner">
          {expanded ? (
            <div
              className="idea-expand-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-[12px] font-semibold text-muted-foreground">
                {formatUsd(idea.estimatedCost)} · {formatHours(idea.estimatedHours)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {extraScores.map((field) => (
                  <span
                    key={field.key}
                    className="rounded-full bg-white px-2 py-0.5 text-[12px] text-muted-foreground"
                  >
                    {field.label}{" "}
                    <span className="font-rating text-foreground">
                      {idea.scores[field.key].toFixed(1)}
                    </span>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" className="h-8" onClick={onEdit}>
                  Edit
                </Button>
                <Button className="h-8" onClick={onPromote}>
                  Promote to Developing
                </Button>
              </div>
            </div>
          ) : (
            <div className="idea-expand-panel" hidden />
          )}
        </div>
      </div>
    </article>
  )
}
