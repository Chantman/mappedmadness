import { CardMenu } from "@/components/actions/card-menu"
import { StageMedia } from "@/components/media/stage-media"
import { Button } from "@/components/ui/button"
import { developmentCopy } from "@/data/catalog"
import type { Project } from "@/data/types"
import { formatHours, formatPercent, formatUsd } from "@/lib/format"
import { useWorkshop } from "@/state/workshop-store"

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
  const status = project.developmentStatus
    ? developmentCopy[project.developmentStatus]
    : "Concept"

  return (
    <article
      data-enter={highlighted ? "true" : undefined}
      className="developing-card"
    >
      <button
        type="button"
        className="media-frame block w-full overflow-hidden rounded-t-[14px] text-left"
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
              <span className="workshop-label bg-[#d7f0ff] text-[#0f78b0]">
                🎨 {status}
              </span>
            </p>
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
                label: "Back to Ideas",
                onSelect: () => demoteProject(project.id),
              },
            ]}
          />
        </div>
        <p className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
          {project.concept}
        </p>
        <div className="flex justify-between text-[12px] font-semibold text-[#0f78b0]">
          <span>{formatPercent(project.partsCoverage)} parts</span>
          <span>{formatUsd(project.missingPartsCost)} missing</span>
          <span>{formatHours(project.estimatedHours)}</span>
        </div>
        {project.unresolvedQuestion ? (
          <p className="line-clamp-2 text-[13px] leading-5 text-blocked">
            {project.unresolvedQuestion}
          </p>
        ) : null}
        <Button
          className="h-9 bg-stage-developing text-[14px] text-white hover:bg-stage-developing/90"
          onClick={onOpen}
        >
          Continue Developing
        </Button>
      </div>
    </article>
  )
}
