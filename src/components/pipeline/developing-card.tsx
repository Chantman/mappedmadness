import { useState } from "react"

import { CardMenu } from "@/components/actions/card-menu"
import { BrandChip } from "@/components/brand/brand-chip"
import { StageMedia } from "@/components/media/stage-media"
import { RatingBadge } from "@/components/pipeline/rating-badge"
import { Button } from "@/components/ui/button"
import { developmentCopy } from "@/data/catalog"
import type { Project } from "@/data/types"
import { formatHours, formatPercent, formatUsd } from "@/lib/format"
import { partsOwnedPercent, toDifficulty } from "@/lib/metrics"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

function developingStatus(project: Project) {
  if (project.newlyPromoted) return "Newly promoted"
  if (project.developmentStatus && project.developmentStatus !== "concept") {
    return developmentCopy[project.developmentStatus]
  }
  return "Needs planning"
}

export function DevelopingCard({
  project,
  highlighted,
  onOpen,
}: {
  project: Project
  highlighted?: boolean
  onOpen: () => void
}) {
  const { openCapture, demoteProject } = useWorkshop()
  const [expanded, setExpanded] = useState(false)
  const scores = project.origin?.scores
  const promotedFromIdea = Boolean(project.newlyPromoted || scores)
  const status = promotedFromIdea
    ? developingStatus(project)
    : project.developmentStatus
      ? developmentCopy[project.developmentStatus]
      : "Concept"

  return (
    <article
      data-enter={highlighted ? "true" : undefined}
      className="developing-card"
    >
      <button
        type="button"
        className="media-frame block w-full overflow-hidden text-left"
        onClick={onOpen}
        aria-label={`${project.title} concept`}
      >
        <StageMedia
          visualId={project.visualId}
          imageUrl={project.imageUrl}
          label={project.title}
          className="aspect-video h-auto"
        />
      </button>
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading truncate text-[17px] leading-5">
              {project.title}
            </h3>
            <p className="mt-1">
              <span className="workshop-label bg-[var(--chartreuse)] text-[var(--ink)]">
                {promotedFromIdea ? status : `🎨 ${status}`}
              </span>
            </p>
            {promotedFromIdea ? (
              <BrandChip className="mt-1.5" brandId={project.brandId} />
            ) : null}
          </div>
          <CardMenu
            label={`${project.title} actions`}
            items={[
              { label: "Open project", onSelect: onOpen },
              {
                label: "Catch a related note",
                onSelect: () => openCapture(`${project.title}: `),
              },
              {
                label: "Return to Raw Ideas",
                onSelect: () => demoteProject(project.id),
              },
            ]}
          />
        </div>
        <p
          className={cn(
            "text-[13px] leading-5 text-muted-foreground",
            promotedFromIdea && expanded
              ? "whitespace-pre-wrap"
              : "line-clamp-2",
          )}
        >
          {project.concept}
        </p>
        {promotedFromIdea && project.concept.length > 140 ? (
          <button
            type="button"
            className="self-start text-[12px] font-semibold text-primary"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Show less" : "Read full description"}
          </button>
        ) : null}
        {scores ? (
          <div className="developing-card-ratings">
            <RatingBadge
              kind="viral"
              value={scores.viralPotential.toFixed(1)}
            />
            <RatingBadge
              kind="difficulty"
              value={toDifficulty(scores.simplicity).toFixed(1)}
            />
            <RatingBadge
              kind="parts"
              value={`${partsOwnedPercent(scores.partsCoverage)}%`}
            />
          </div>
        ) : null}
        {promotedFromIdea ? null : (
          <>
            <div className="flex justify-between text-[12px] font-semibold text-[var(--chartreuse-ink)]">
              <span>{formatPercent(project.partsCoverage)} parts</span>
              <span>{formatUsd(project.missingPartsCost)} missing</span>
              <span>{formatHours(project.estimatedHours)}</span>
            </div>
            {project.unresolvedQuestion ? (
              <p className="line-clamp-2 text-[13px] leading-5 text-blocked">
                {project.unresolvedQuestion}
              </p>
            ) : null}
          </>
        )}
        <Button
          className="h-9 bg-stage-developing text-[14px] text-[var(--ink)] hover:bg-stage-developing/90"
          onClick={onOpen}
        >
          {promotedFromIdea ? "Open Development" : "Continue Developing"}
        </Button>
      </div>
    </article>
  )
}
