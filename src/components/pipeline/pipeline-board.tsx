import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"

import { EmptyStageRoute } from "@/components/branding/MappedMadnessMark"
import { ScribbleBackdrop } from "@/components/branding/ScribbleBackdrop"
import { IdeaDrawer } from "@/components/drawers/idea-drawer"
import { ProjectDrawer } from "@/components/drawers/project-drawer"
import { DevelopingCard } from "@/components/pipeline/developing-card"
import { IdeaRow } from "@/components/pipeline/idea-card"
import { PipelineColumn } from "@/components/pipeline/pipeline-column"
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
import { matchesQuery } from "@/lib/format"
import { IDEA_SORTS, sortIdeas } from "@/lib/idea-sort"
import { prefersReducedMotion } from "@/lib/motion"
import { useBrandIdeas, useBrandProjects, useWorkshop } from "@/state/workshop-store"

export function PipelineBoard() {
  const { ideaSort, setIdeaSort, promoteIdea, demoteProject, openCapture } =
    useWorkshop()
  const ranked = sortIdeas(useBrandIdeas(), ideaSort)
  const projects = useBrandProjects()
  const developing = projects.filter((project) => project.stage === "developing")
  const production = projects.filter((project) => project.stage === "in-production")
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
    promoteIdea(id)
    setLeavingId(null)
    setExpandedIdeaId(null)
    setHighlightId(id)
    setPromoting(false)
    setPulseDeveloping(true)
    setActiveLane("developing")
    setToast({ title: `${title} graduated to Developing 🎓`, undoId: id })
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

  return (
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

          <PipelineColumn
            stage="developing"
            count={developing.length}
            flash={pulseDeveloping}
            empty={
              <div className="lane-empty">
                <ScribbleBackdrop variant="emptyState" />
                <EmptyStageRoute className="empty-stage-route" />
                <p className="font-heading empty-stage-copy text-[16px]">
                  Nothing on the drawing board yet
                </p>
                <p className="empty-stage-copy mt-1 max-w-[16rem] text-[13px] leading-5 text-muted-foreground">
                  Promote a raw idea when you’re ready to work it out.
                </p>
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
          </PipelineColumn>

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

      {toast ? (
        <div
          role="status"
          className="studio-toast fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl px-3 py-2 text-[14px]"
        >
          <span>{toast.title}</span>
          <Button
            variant="ghost"
            className="h-7 text-[13px] text-purple"
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
  )
}
