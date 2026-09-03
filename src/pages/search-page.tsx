import { useMemo } from "react"

import { Input } from "@/components/ui/input"
import { brandById } from "@/data/catalog"
import { matchesQuery } from "@/lib/format"
import { useWorkshop } from "@/state/workshop-store"

export function SearchPage() {
  const { query, setQuery, ideas, projects, inventory, setView, brandId } =
    useWorkshop()

  const ideaHits = useMemo(
    () =>
      ideas.filter(
        (idea) =>
          idea.brandId === brandId &&
          matchesQuery(`${idea.title} ${idea.concept}`, query),
      ),
    [ideas, brandId, query],
  )
  const projectHits = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.brandId === brandId &&
          matchesQuery(`${project.title} ${project.concept} ${project.stage}`, query),
      ),
    [projects, brandId, query],
  )
  const partHits = useMemo(
    () =>
      inventory.filter((item) =>
        matchesQuery(`${item.name} ${item.location}`, query),
      ),
    [inventory, query],
  )

  return (
    <div className="max-w-3xl">
      <p className="text-[14px] text-muted-foreground">Find</p>
      <h1 className="font-heading mt-1 text-[32px]">Search</h1>
      <Input
        className="mt-5 h-11 text-[15px]"
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search this brand’s ideas and builds, plus all parts"
        aria-label="Search"
      />
      {!query.trim() ? (
        <p className="mt-6 text-[15px] text-muted-foreground">
          Type a title, concept, or part name.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="text-[18px] font-medium">Ideas</h2>
            {ideaHits.length === 0 ? (
              <p className="mt-2 text-muted-foreground">No ideas match.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {ideaHits.map((idea) => (
                  <li key={idea.id}>
                    <button
                      type="button"
                      className="text-left text-[16px] hover:text-brand"
                      onClick={() => setView("workspace")}
                    >
                      {idea.title}
                    </button>
                    <p className="text-[14px] text-muted-foreground">{idea.concept}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-[18px] font-medium">Builds</h2>
            {projectHits.length === 0 ? (
              <p className="mt-2 text-muted-foreground">No builds match.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {projectHits.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      className="text-left text-[16px] hover:text-brand"
                      onClick={() =>
                        setView(
                          project.stage === "completed"
                            ? "completed"
                            : "workspace",
                        )
                      }
                    >
                      {project.title}
                    </button>
                    <p className="text-[14px] text-muted-foreground">
                      {brandById[project.brandId].name} · {project.stage}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-[18px] font-medium">Parts</h2>
            {partHits.length === 0 ? (
              <p className="mt-2 text-muted-foreground">No parts match.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {partHits.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="text-left text-[16px] hover:text-brand"
                      onClick={() => setView("inventory")}
                    >
                      {item.name}
                    </button>
                    <p className="text-[13px] text-muted-foreground">
                      {item.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
