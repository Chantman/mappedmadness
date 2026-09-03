import { CardMenu } from "@/components/actions/card-menu"
import { StageMedia } from "@/components/media/stage-media"
import { ScoreMeter } from "@/components/pipeline/score-meter"
import { TapeStrip } from "@/components/studio/primitives"
import { Button } from "@/components/ui/button"
import { productionCopy } from "@/data/catalog"
import type { Project } from "@/data/types"
import { formatCaptured } from "@/lib/format"
import { useWorkshop } from "@/state/workshop-store"

export function ProductionCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  const { setProjectStage, openCapture } = useWorkshop()
  const checklist = project.checklist
  const done = checklist
    ? Object.values(checklist).filter(Boolean).length
    : 0
  const status = productionCopy[project.productionStatus ?? "planning"]

  return (
    <article className="production-card">
      <TapeStrip placement="pin" />
      <button
        type="button"
        className="media-frame block w-full text-left"
        onClick={onOpen}
        aria-label={`${project.title} still`}
      >
        <StageMedia
          visualId={project.visualId}
          imageUrl={project.imageUrl}
          label={project.title}
          className="h-[112px]"
        />
      </button>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading text-[17px] leading-5 break-words">
              {project.title}
            </h3>
            <p className="mt-1">
              <span className="workshop-label bg-[var(--coral)] text-[#fffdf6]">
                🔧 {status}
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
                label: "Mark completed",
                onSelect: () => setProjectStage(project.id, "completed"),
              },
            ]}
          />
        </div>
        {project.nextPhysicalAction ? (
          <p className="line-clamp-2 text-[13px] leading-5">
            {project.nextPhysicalAction}
          </p>
        ) : null}
        {project.blocker ? (
          <p className="line-clamp-1 text-[12px] text-blocked">{project.blocker}</p>
        ) : null}
        <div className="flex flex-col gap-1 text-[12px] font-semibold text-[var(--coral-ink)]">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <ScoreMeter value={done / 6} segments={6} className="text-stage-production" />
            <span className="min-w-0">{done} of 6 captured</span>
          </span>
          <span className="min-w-0 break-words">
            {project.targetDate ? formatCaptured(project.targetDate) : "No date"}
          </span>
        </div>
        <Button
          className="h-8 bg-stage-production text-[13px] text-[#fffdf6] hover:bg-stage-production/90"
          onClick={onOpen}
        >
          Open Project
        </Button>
      </div>
    </article>
  )
}
