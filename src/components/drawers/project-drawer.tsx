import { useState } from "react"

import { CopyButton } from "@/components/actions/copy-button"
import { StageMedia } from "@/components/media/stage-media"
import { DebriefForm } from "@/components/project/debrief-modal"
import { ImageDialog, PartsDialog } from "@/components/project/studio-dialogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  checklistCopy,
  developmentCopy,
  productionCopy,
} from "@/data/catalog"
import type { ContentChecklist, ProductionStatus, Project } from "@/data/types"
import { formatCaptured } from "@/lib/format"
import { composeDesignPrompt, composeImagePrompt } from "@/lib/prompts"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

const statuses: ProductionStatus[] = [
  "planning",
  "parts-ordered",
  "ready-to-build",
  "building",
  "filming",
  "editing",
]

export function ProjectDrawer({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    updateProject,
    startBuild,
    setProjectStage,
    toggleChecklist,
    demoteProject,
  } = useWorkshop()
  const [partsOpen, setPartsOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)

  if (!project) return null

  const checklist = project.checklist

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-[18px]">{project.title}</SheetTitle>
          <SheetDescription>
            {project.stage === "completed"
              ? "Archive notes and sample metrics stay labeled as sample."
              : "Operate the project here. The board stays a scan view."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="media-frame overflow-hidden rounded-md">
            <StageMedia
              visualId={project.visualId}
              imageUrl={project.imageUrl}
              label={project.title}
              className="aspect-video h-auto"
            />
          </div>

          {project.stage === "developing" ? (
            <>
              <p className="text-[13px] text-muted-foreground">
                {project.developmentStatus
                  ? developmentCopy[project.developmentStatus]
                  : "Concept"}
              </p>
              <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                Design summary
                <Textarea
                  value={project.concept}
                  onChange={(event) =>
                    updateProject(project.id, { concept: event.target.value })
                  }
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                Unresolved question
                <Textarea
                  value={project.unresolvedQuestion ?? ""}
                  onChange={(event) =>
                    updateProject(project.id, {
                      unresolvedQuestion: event.target.value,
                    })
                  }
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <CopyButton
                  label="Copy Design Prompt"
                  text={composeDesignPrompt(project)}
                />
                <CopyButton
                  label="Copy Image Prompt"
                  text={composeImagePrompt(project)}
                />
                <Button variant="outline" size="sm" onClick={() => setImageOpen(true)}>
                  Add Concept Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPartsOpen(true)}>
                  Edit Parts
                </Button>
              </div>
              <Button onClick={() => startBuild(project.id)}>Start Build</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  demoteProject(project.id)
                  onOpenChange(false)
                }}
              >
                Back to Ideas
              </Button>
            </>
          ) : null}

          {project.stage === "in-production" ? (
            <>
              <label className="text-[13px] text-muted-foreground">
                Status
                <select
                  className="studio-select mt-1 h-9 w-full rounded-md px-2 text-[14px] text-foreground"
                  value={project.productionStatus ?? "planning"}
                  onChange={(event) =>
                    updateProject(project.id, {
                      productionStatus: event.target.value as ProductionStatus,
                    })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {productionCopy[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                Next physical action
                <Textarea
                  value={project.nextPhysicalAction ?? ""}
                  onChange={(event) =>
                    updateProject(project.id, {
                      nextPhysicalAction: event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                Blocker
                <Input
                  value={project.blocker ?? ""}
                  onChange={(event) =>
                    updateProject(project.id, { blocker: event.target.value })
                  }
                />
              </label>
              <div className="text-[12px] text-dim tabular-nums">
                Target{" "}
                {project.targetDate
                  ? formatCaptured(project.targetDate)
                  : "not set"}
              </div>
              {checklist ? (
                <fieldset className="flex flex-col gap-1.5">
                  <legend className="mb-1 text-[13px] text-muted-foreground">
                    Content capture
                  </legend>
                  {(Object.keys(checklistCopy) as (keyof ContentChecklist)[]).map(
                    (key) => (
                      <label
                        key={key}
                        className={cn(
                          "flex items-center gap-2 text-[14px]",
                          checklist[key]
                            ? "text-muted-foreground"
                            : "text-foreground",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checklist[key]}
                          onChange={() => toggleChecklist(project.id, key)}
                          className="size-4 accent-brand"
                        />
                        {checklistCopy[key]}
                      </label>
                    ),
                  )}
                </fieldset>
              ) : null}
              <Button
                variant="outline"
                onClick={() => setPartsOpen(true)}
              >
                Edit Parts
              </Button>
              <Button
                onClick={() => {
                  setProjectStage(project.id, "completed")
                  onOpenChange(false)
                }}
              >
                Move to Completed
              </Button>
            </>
          ) : null}

          {project.stage === "completed" ? (
            <DebriefForm
              project={project}
              onSaved={() => onOpenChange(false)}
            />
          ) : null}
        </div>
        {partsOpen ? (
          <PartsDialog
            open={partsOpen}
            onOpenChange={setPartsOpen}
            owned={project.partsOwned}
            missing={project.partsMissing}
            onSave={(next) => updateProject(project.id, next)}
          />
        ) : null}
        {imageOpen ? (
          <ImageDialog
            open={imageOpen}
            onOpenChange={setImageOpen}
            onSave={(url) => updateProject(project.id, { imageUrl: url })}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
