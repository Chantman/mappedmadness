import { CardMenu } from "@/components/actions/card-menu"
import { StageMedia } from "@/components/media/stage-media"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/types"
import { formatHours, formatUsd } from "@/lib/format"
import { useWorkshop } from "@/state/workshop-store"

export function CompletedCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  const { openCapture } = useWorkshop()

  return (
    <article className="completed-entry">
      <div className="media-frame size-16 shrink-0 rounded-[10px]">
        <StageMedia
          visualId={project.visualId}
          imageUrl={project.imageUrl}
          label={project.title}
          className="size-16"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-heading truncate text-[15px] leading-5">
            🏁 {project.title}
          </h3>
          <CardMenu
            label={`${project.title} actions`}
            items={[
              { label: "Open debrief", onSelect: onOpen },
              {
                label: "Catch a related note",
                onSelect: () => openCapture(`${project.title}: `),
              },
            ]}
          />
        </div>
        {project.bestResult ? (
          <p className="truncate text-[12px] text-foreground">
            {project.bestResult}
          </p>
        ) : null}
        <p className="text-[12px] font-semibold text-[#1d8a52]">
          {formatUsd(project.actualCost ?? 0)} ·{" "}
          {formatHours(project.actualBuildTimeHours ?? 0)}
          {project.revenueOrInquiries
            ? ` · ${project.revenueOrInquiries}`
            : null}
        </p>
        {project.lesson ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-muted-foreground">
            {project.lesson}
          </p>
        ) : null}
        <Button
          variant="ghost"
          className="mt-1 h-7 px-0 text-[12px] text-stage-completed hover:bg-transparent hover:text-stage-completed"
          onClick={onOpen}
        >
          Open Debrief
        </Button>
      </div>
    </article>
  )
}
