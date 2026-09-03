import { Brain, Cog, Search } from "lucide-react"

import { WorkflowRoute } from "@/components/pipeline/workflow-route"

const stages = [
  {
    id: "ideas",
    label: "Raw Ideas",
    Icon: Brain,
    countKey: "ideas",
  },
  {
    id: "developing",
    label: "Developing",
    Icon: Search,
    countKey: "developing",
  },
  {
    id: "production",
    label: "In Production",
    Icon: Cog,
    countKey: "production",
  },
] as const

export type WorkflowLane = (typeof stages)[number]["id"]

export function WorkflowStepper({
  ideas,
  developing,
  production,
  promoting = false,
  pulseDeveloping = false,
  activeLane,
  onSelectLane,
}: {
  ideas: number
  developing: number
  production: number
  promoting?: boolean
  pulseDeveloping?: boolean
  activeLane: WorkflowLane
  onSelectLane: (lane: WorkflowLane) => void
}) {
  const counts = { ideas, developing, production }

  return (
    <header className="workflow-header">
      <WorkflowRoute
        promoting={promoting}
        pulseDeveloping={pulseDeveloping}
      />
      <ol className="workflow-stepper" aria-label="Project workflow">
        {stages.map((stage) => {
          const Icon = stage.Icon
          const count = counts[stage.countKey]
          return (
            <li
              key={stage.id}
              className="workflow-step"
              data-stage={stage.id}
            >
              <span className="workflow-step-copy">
                <span className="workflow-step-label">
                  <Icon className="workflow-step-icon" strokeWidth={2.1} />
                  {stage.label}
                </span>
                <span className="workflow-step-count">{count}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="workflow-tabs" role="tablist" aria-label="Workflow stage">
        {stages.map((stage) => {
          const selected = activeLane === stage.id
          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className="workflow-tab"
              data-stage={stage.id}
              data-selected={selected ? "true" : undefined}
              onClick={() => onSelectLane(stage.id)}
            >
              <span className="workflow-tab-dot" aria-hidden="true" />
              <span className="workflow-tab-label">{stage.label}</span>
              <span className="workflow-tab-count">{counts[stage.countKey]}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
