import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { DATA_VERSION } from "@/data/seed-data"
import type {
  AppView,
  BrandId,
  ContentChecklist,
  Idea,
  IdeaSort,
  Project,
  ProjectDebrief,
  ProjectStage,
} from "@/data/types"
import { emptyChecklist } from "@/data/types"
import {
  ideas as seedIdeas,
  inventory,
  projects as seedProjects,
} from "@/data/workshop"
import { readStorage, writeStorage } from "@/lib/storage"

interface WorkshopContextValue {
  view: AppView
  setView: (view: AppView) => void
  brandId: BrandId
  setBrandId: (id: BrandId) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean) => void
  query: string
  setQuery: (query: string) => void
  ideaSort: IdeaSort
  setIdeaSort: (sort: IdeaSort) => void
  captureOpen: boolean
  setCaptureOpen: (open: boolean) => void
  capturePrefill: string
  openCapture: (prefill?: string) => void
  ideas: Idea[]
  projects: Project[]
  inventory: typeof inventory
  addIdea: (input: { title: string; concept: string }) => void
  updateIdea: (id: string, patch: Partial<Idea>) => void
  promoteIdea: (id: string) => void
  demoteProject: (id: string) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  setProjectStage: (id: string, stage: ProjectStage) => void
  startBuild: (id: string) => void
  toggleChecklist: (id: string, key: keyof ContentChecklist) => void
  saveDebrief: (id: string, debrief: ProjectDebrief) => void
  resetLocalData: () => void
}

const WorkshopContext = createContext<WorkshopContextValue | null>(null)

function midScores() {
  return {
    simplicity: 5,
    viralPotential: 5,
    profitability: 5,
    partsCoverage: 5,
    contentPotential: 5,
    brandFit: 6,
    seasonalUrgency: 5,
    excitement: 6,
    readiness: 4,
  }
}

function loadVersioned<T>(name: string, fallback: T): T {
  const version = readStorage<string>("data-version", "")
  if (version !== DATA_VERSION) return fallback
  return readStorage(name, fallback)
}

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>("workspace")
  const [brandId, setBrandIdState] = useState<BrandId>(() =>
    readStorage("brand", "ocean-in-things"),
  )
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() =>
    readStorage("sidebar-collapsed", false),
  )
  const [query, setQuery] = useState("")
  const [ideaSort, setIdeaSortState] = useState<IdeaSort>(() =>
    readStorage("idea-sort", "best-overall"),
  )
  const [captureOpen, setCaptureOpen] = useState(false)
  const [capturePrefill, setCapturePrefill] = useState("")
  const [ideas, setIdeas] = useState<Idea[]>(() =>
    loadVersioned("ideas", seedIdeas),
  )
  const [projects, setProjects] = useState<Project[]>(() =>
    loadVersioned("projects", seedProjects),
  )

  useEffect(() => {
    writeStorage("data-version", DATA_VERSION)
    writeStorage("brand", brandId)
    writeStorage("sidebar-collapsed", sidebarCollapsed)
    writeStorage("idea-sort", ideaSort)
    writeStorage("ideas", ideas)
    writeStorage("projects", projects)
  }, [brandId, sidebarCollapsed, ideaSort, ideas, projects])

  const setBrandId = useCallback((id: BrandId) => {
    setBrandIdState(id)
  }, [])

  const setSidebarCollapsed = useCallback((value: boolean) => {
    setSidebarCollapsedState(value)
  }, [])

  const setIdeaSort = useCallback((sort: IdeaSort) => {
    setIdeaSortState(sort)
  }, [])

  const openCapture = useCallback((prefill = "") => {
    setCapturePrefill(prefill)
    setCaptureOpen(true)
  }, [])

  const addIdea = useCallback(
    (input: { title: string; concept: string }) => {
      const idea: Idea = {
        id: crypto.randomUUID(),
        title: input.title,
        concept: input.concept,
        brandId,
        capturedAt: new Date().toISOString(),
        visualId: "captured-idea",
        scores: midScores(),
        estimatedCost: 0,
        estimatedHours: 8,
      }
      setIdeas((current) => [idea, ...current])
    },
    [brandId],
  )

  const promoteIdea = useCallback((id: string) => {
    const idea = ideas.find((item) => item.id === id)
    if (!idea) return

    const project: Project = {
      id: idea.id,
      title: idea.title,
      brandId: idea.brandId,
      stage: "developing",
      concept: idea.concept,
      visualId: idea.visualId,
      imageUrl: idea.imageUrl,
      intendedEffect: idea.concept,
      designDecisions: "Not recorded yet.",
      constraints: "Not recorded yet.",
      toolsAndSkills: "CAD, PETG printing, Pico-class firmware, filming.",
      partsOwned: [],
      partsMissing: [],
      estimatedHours: idea.estimatedHours,
      estimatedCost: idea.estimatedCost,
      developmentStatus: "concept",
      partsCoverage: idea.scores.partsCoverage * 10,
      missingPartsCost: idea.estimatedCost,
      unresolvedQuestion: "What is the first physical prototype?",
      origin: idea,
    }

    setIdeas((current) => current.filter((item) => item.id !== id))
    setProjects((current) =>
      current.some((item) => item.id === id) ? current : [project, ...current],
    )
  }, [ideas])

  const updateIdea = useCallback((id: string, patch: Partial<Idea>) => {
    setIdeas((current) =>
      current.map((idea) => (idea.id === id ? { ...idea, ...patch } : idea)),
    )
  }, [])

  const demoteProject = useCallback((id: string) => {
    const project = projects.find((item) => item.id === id)
    if (!project) return
    const idea: Idea = project.origin ?? {
      id: project.id,
      title: project.title,
      concept: project.concept,
      brandId: project.brandId,
      capturedAt: new Date().toISOString(),
      visualId: project.visualId,
      imageUrl: project.imageUrl,
      scores: midScores(),
      estimatedCost: project.estimatedCost,
      estimatedHours: project.estimatedHours,
    }
    setProjects((current) => current.filter((item) => item.id !== id))
    setIdeas((current) =>
      current.some((item) => item.id === id) ? current : [idea, ...current],
    )
  }, [projects])

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...patch } : project,
      ),
    )
  }, [])

  const setProjectStage = useCallback((id: string, stage: ProjectStage) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== id) return project
        if (stage === "in-production") {
          return {
            ...project,
            stage,
            productionStatus: project.productionStatus ?? "planning",
            checklist: project.checklist ?? emptyChecklist(),
            remainingPartsCost:
              project.remainingPartsCost ?? project.missingPartsCost,
            nextPhysicalAction:
              project.nextPhysicalAction ?? "Set the first bench task.",
          }
        }
        return { ...project, stage }
      }),
    )
  }, [])

  const startBuild = useCallback(
    (id: string) => {
      setProjectStage(id, "in-production")
    },
    [setProjectStage],
  )

  const toggleChecklist = useCallback(
    (id: string, key: keyof ContentChecklist) => {
      setProjects((current) =>
        current.map((project) => {
          if (project.id !== id) return project
          const checklist = project.checklist ?? emptyChecklist()
          return {
            ...project,
            checklist: { ...checklist, [key]: !checklist[key] },
          }
        }),
      )
    },
    [],
  )

  const saveDebrief = useCallback((id: string, debrief: ProjectDebrief) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              debrief,
              actualCost: debrief.actualCost,
              actualBuildTimeHours: debrief.actualBuildTimeHours,
              lesson: debrief.whatToRepeat || project.lesson,
            }
          : project,
      ),
    )
  }, [])

  const resetLocalData = useCallback(() => {
    setIdeas(seedIdeas)
    setProjects(seedProjects)
    setIdeaSortState("best-overall")
  }, [])

  const value = useMemo(
    () => ({
      view,
      setView,
      brandId,
      setBrandId,
      sidebarCollapsed,
      setSidebarCollapsed,
      query,
      setQuery,
      ideaSort,
      setIdeaSort,
      captureOpen,
      setCaptureOpen,
      capturePrefill,
      openCapture,
      ideas,
      projects,
      inventory,
      addIdea,
      updateIdea,
      promoteIdea,
      demoteProject,
      updateProject,
      setProjectStage,
      startBuild,
      toggleChecklist,
      saveDebrief,
      resetLocalData,
    }),
    [
      view,
      brandId,
      setBrandId,
      sidebarCollapsed,
      setSidebarCollapsed,
      query,
      ideaSort,
      setIdeaSort,
      captureOpen,
      capturePrefill,
      openCapture,
      ideas,
      projects,
      addIdea,
      updateIdea,
      promoteIdea,
      demoteProject,
      updateProject,
      setProjectStage,
      startBuild,
      toggleChecklist,
      saveDebrief,
      resetLocalData,
    ],
  )

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  )
}

export function useWorkshop() {
  const context = useContext(WorkshopContext)
  if (!context) {
    throw new Error("useWorkshop must be used within WorkshopProvider")
  }
  return context
}

export function useBrandProjects() {
  const { brandId, projects } = useWorkshop()
  return projects.filter((project) => project.brandId === brandId)
}

export function useBrandIdeas() {
  const { brandId, ideas } = useWorkshop()
  return ideas.filter((idea) => idea.brandId === brandId)
}
