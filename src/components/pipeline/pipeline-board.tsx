import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { ChevronDown, Search } from "lucide-react"

import {
  HandwrittenAnnotation,
  TapeStrip,
  WaveSketch,
} from "@/components/studio/primitives"
import { IdeaDrawer } from "@/components/drawers/idea-drawer"
import { ProjectDrawer } from "@/components/drawers/project-drawer"
import { DevelopingCard } from "@/components/pipeline/developing-card"
import { IdeaDragPreview, IdeaRow } from "@/components/pipeline/idea-card"
import {
  DEVELOPING_DROP_ID,
  PipelineColumn,
} from "@/components/pipeline/pipeline-column"
import { ProductionCard } from "@/components/pipeline/production-card"
import {
  WorkflowStepper,
  type WorkflowLane,
} from "@/components/pipeline/workflow-stepper"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ideaSortCopy } from "@/data/catalog"
import type { Idea } from "@/data/types"
import { matchesQuery } from "@/lib/format"
import { IDEA_SORTS, sortIdeas } from "@/lib/idea-sort"
import { prefersReducedMotion } from "@/lib/motion"
import { useMediaQuery } from "@/lib/use-media-query"
import { useBrandIdeas, useBrandProjects, useWorkshop } from "@/state/workshop-store"

const detectDevelopingDrop: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args)
  if (pointerHits.length > 0) return pointerHits
  return rectIntersection(args)
}

function DevelopingLane({
  count,
  flash,
  empty,
  children,
}: {
  count: number
  flash?: boolean
  empty?: ReactNode
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: DEVELOPING_DROP_ID,
    data: { type: "lane", stage: "developing" },
  })

  return (
    <PipelineColumn
      stage="developing"
      count={count}
      flash={flash}
      empty={empty}
      droppableRef={setNodeRef}
      isDropTarget={isOver}
    >
      {children}
    </PipelineColumn>
  )
}

export function PipelineBoard() {
  const { ideaSort, setIdeaSort, promoteIdeaToDeveloping, demoteProject, openCapture } =
    useWorkshop()
  const ranked = sortIdeas(useBrandIdeas(), ideaSort)
  const projects = useBrandProjects()
  const developing = projects.filter((project) => project.stage === "developing")
  const production = projects.filter((project) => project.stage === "in-production")
  const desktopColumns = useMediaQuery("(min-width: 1000px)")
  const [activeLane, setActiveLane] = useState<WorkflowLane>("ideas")

  const [ideaFilter, setIdeaFilter] = useState("")
  const [expandedIdeaId, setExpandedIdeaId] = useState<string | null>(null)
  const [editIdeaId, setEditIdeaId] = useState<string | null>(null)
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const [leavingId, setLeavingId] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [promoting, setPromoting] = useState(false)
  const [pulseDeveloping, setPulseDeveloping] = useState(false)
  const [toast, setToast] = useState<{ title: string; undoId: string } | null>(
    null,
  )
  const [announce, setAnnounce] = useState("")
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const ideas = useMemo(
    () =>
      ranked.filter((idea) =>
        matchesQuery(`${idea.title} ${idea.concept}`, ideaFilter),
      ),
    [ranked, ideaFilter],
  )

  const editIdea = ranked.find((idea) => idea.id === editIdeaId) ?? null
  const openProject =
    projects.find((project) => project.id === openProjectId) ?? null

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!highlightId) return
    const timer = window.setTimeout(() => setHighlightId(null), 800)
    return () => window.clearTimeout(timer)
  }, [highlightId])

  useEffect(() => {
    if (!pulseDeveloping) return
    const timer = window.setTimeout(() => setPulseDeveloping(false), 400)
    return () => window.clearTimeout(timer)
  }, [pulseDeveloping])

  function finishPromote(id: string, title: string) {
    promoteIdeaToDeveloping(id)
    setLeavingId(null)
    setExpandedIdeaId(null)
    setHighlightId(id)
    setPromoting(false)
    setPulseDeveloping(true)
    setActiveLane("developing")
    setAnnounce(`${title} moved to Developing.`)
    setToast({ title, undoId: id })
  }

  function handlePromote(id: string) {
    const idea = ranked.find((item) => item.id === id)
    const title = idea?.title ?? "Idea"
    if (prefersReducedMotion()) {
      finishPromote(id, title)
      return
    }
    setLeavingId(id)
    setPromoting(true)
    window.setTimeout(() => finishPromote(id, title), 360)
  }

  function clearDrag() {
    setActiveIdea(null)
    delete document.body.dataset.draggingIdea
  }

  function handleDragStart(event: DragStartEvent) {
    const idea = event.active.data.current?.idea as Idea | undefined
    if (!idea) return
    setActiveIdea(idea)
    document.body.dataset.draggingIdea = "true"
  }

  function handleDragEnd(event: DragEndEvent) {
    const idea = (event.active.data.current?.idea as Idea | undefined) ?? activeIdea
    const overDeveloping = event.over?.id === DEVELOPING_DROP_ID
    clearDrag()
    if (!idea || !overDeveloping) return
    finishPromote(idea.id, idea.title)
  }

  function handleDragCancel() {
    clearDrag()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={detectDevelopingDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="pipeline-frame">
        <div className="pipeline-shell">
          <WorkflowStepper
            ideas={ranked.length}
            developing={developing.length}
            production={production.length}
            promoting={promoting}
            pulseDeveloping={pulseDeveloping}
            activeLane={activeLane}
            onSelectLane={setActiveLane}
          />
          <div className="pipeline-grid flex-1" data-lane={activeLane}>
            <PipelineColumn
              stage="ideas"
              count={ideas.length}
              toolbar={
                <div className="flex flex-col gap-2 border-b border-border px-3 py-2.5">
                  <div>
                    <p className="font-heading text-[15px]">🧠 Raw Ideas</p>
                    <p className="text-[12px] text-muted-foreground">
                      {ideas.length} bouncing around
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <div className="relative min-w-0 flex-1">
                      <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={ideaFilter}
                        onChange={(event) => setIdeaFilter(event.target.value)}
                        placeholder="Search"
                        aria-label="Search ideas"
                        className="h-8 bg-white pl-7 text-[13px]"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 max-w-[10.5rem] shrink-0 justify-between bg-white px-2 text-[12px]"
                        >
                          <span className="truncate">{ideaSortCopy[ideaSort]}</span>
                          <ChevronDown className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        {IDEA_SORTS.map((sort) => (
                          <DropdownMenuItem
                            key={sort}
                            onSelect={() => setIdeaSort(sort)}
                          >
                            {ideaSortCopy[sort]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      className="h-8 shrink-0 px-2.5 text-[12px]"
                      onClick={() => openCapture()}
                    >
                      Catch an idea
                    </Button>
                  </div>
                </div>
              }
              empty={
                ranked.length === 0 ? (
                  <div className="lane-empty">
                    <p className="font-heading text-[16px]">
                      Nothing bouncing around yet
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Catch an idea to start the pile.
                    </p>
                  </div>
                ) : (
                  <p className="px-3 py-4 text-[13px] text-muted-foreground">
                    No matching ideas.
                  </p>
                )
              }
            >
              {ideas.map((idea, index) => (
                <IdeaRow
                  key={idea.id}
                  idea={idea}
                  rank={index + 1}
                  leaving={leavingId === idea.id}
                  expanded={expandedIdeaId === idea.id}
                  dragEnabled={desktopColumns}
                  onToggle={() =>
                    setExpandedIdeaId((current) =>
                      current === idea.id ? null : idea.id,
                    )
                  }
                  onEdit={() => setEditIdeaId(idea.id)}
                  onPromote={() => handlePromote(idea.id)}
                />
              ))}
            </PipelineColumn>

            <DevelopingLane
              count={developing.length}
              flash={pulseDeveloping}
              empty={
                <div className="lane-empty">
                  <TapeStrip placement="tl" />
                  <TapeStrip placement="br" />
                  <p className="sr-only">
                    Nothing on the drawing board yet. Promote a raw idea when
                    you’re ready to work it out.
                  </p>
                  <WaveSketch className="mb-3" />
                  <HandwrittenAnnotation className="empty-stage-copy text-[26px]" rotate={-5}>
                    BREWING SOMETHING GOOD HERE
                  </HandwrittenAnnotation>
                  <HandwrittenAnnotation
                    className="empty-stage-copy mt-3 max-w-[16rem] text-[18px] text-[var(--chartreuse-ink)]"
                    rotate={3}
                  >
                    DRAG IDEAS HERE TO START BUILDING
                  </HandwrittenAnnotation>
                </div>
              }
            >
              <div className="flex flex-col gap-3 p-3">
                {developing.map((project) => (
                  <DevelopingCard
                    key={project.id}
                    project={project}
                    highlighted={highlightId === project.id}
                    onOpen={() => setOpenProjectId(project.id)}
                  />
                ))}
              </div>
            </DevelopingLane>

            <PipelineColumn
              stage="production"
              count={production.length}
              warning={
                production.length > 1
                  ? `${production.length} major builds are in production.`
                  : undefined
              }
              empty={
                <div className="lane-empty">
                  <p className="font-heading text-[16px]">
                    The workbench is suspiciously quiet
                  </p>
                </div>
              }
            >
              <div className="flex flex-col gap-3 p-3">
                {production.map((project) => (
                  <ProductionCard
                    key={project.id}
                    project={project}
                    onOpen={() => setOpenProjectId(project.id)}
                  />
                ))}
              </div>
            </PipelineColumn>
          </div>
        </div>

        <IdeaDrawer
          idea={editIdea}
          open={Boolean(editIdea)}
          onOpenChange={(open) => {
            if (!open) setEditIdeaId(null)
          }}
          onPromote={handlePromote}
        />
        <ProjectDrawer
          project={openProject}
          open={Boolean(openProject)}
          onOpenChange={(open) => {
            if (!open) setOpenProjectId(null)
          }}
        />

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announce}
        </div>

        {toast ? (
          <div className="studio-toast fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl px-3 py-2 text-[14px]">
            <span>{toast.title} moved to Developing.</span>
            <Button
              variant="ghost"
              className="h-7 text-[13px] text-primary"
              onClick={() => {
                demoteProject(toast.undoId)
                setToast(null)
              }}
            >
              Back to Ideas
            </Button>
          </div>
        ) : null}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeIdea ? <IdeaDragPreview idea={activeIdea} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
