import { useMemo, useState } from "react"

import { CompletionFlourish } from "@/components/branding/MappedMadnessMark"
import { ScribbleBackdrop } from "@/components/branding/ScribbleBackdrop"
import { ProjectDrawer } from "@/components/drawers/project-drawer"
import { CompletedCard } from "@/components/pipeline/completed-card"
import { Input } from "@/components/ui/input"
import { matchesQuery } from "@/lib/format"
import { useBrandProjects } from "@/state/workshop-store"

export function CompletedPage() {
  const projects = useBrandProjects().filter(
    (project) => project.stage === "completed",
  )
  const [filter, setFilter] = useState("")
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const visible = useMemo(
    () =>
      projects.filter((project) =>
        matchesQuery(
          `${project.title} ${project.concept} ${project.lesson} ${project.bestResult}`,
          filter,
        ),
      ),
    [projects, filter],
  )

  const openProject =
    projects.find((project) => project.id === openProjectId) ?? null

  return (
    <div className="mx-auto w-full max-w-4xl">
      <p className="text-[14px] text-muted-foreground">Archive</p>
      <h1 className="font-heading mt-1 text-[32px]">Completed</h1>
      <p className="mt-2 max-w-2xl text-[16px] leading-7 text-muted-foreground">
        Finished builds, results, and lessons. This is the searchable record of
        what already made it through the shop.
      </p>
      <Input
        className="mt-5 h-11 max-w-md text-[15px]"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Search completed work"
        aria-label="Search completed work"
      />

      {projects.length === 0 ? (
        <div className="lane-empty mt-8 min-h-[16rem]">
          <ScribbleBackdrop variant="emptyState" />
          <p className="font-heading text-[16px]">
            Finished builds will earn their spot here
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Mark a production project complete to file it in the archive.
          </p>
          <CompletionFlourish className="completion-flourish" />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-[15px] text-muted-foreground">
          No completed builds match.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {visible.map((project) => (
            <CompletedCard
              key={project.id}
              project={project}
              onOpen={() => setOpenProjectId(project.id)}
            />
          ))}
        </div>
      )}

      <ProjectDrawer
        project={openProject}
        open={Boolean(openProject)}
        onOpenChange={(open) => {
          if (!open) setOpenProjectId(null)
        }}
      />
    </div>
  )
}
