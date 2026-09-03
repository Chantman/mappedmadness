const VIEW_W = 1000
const VIEW_H = 56
const ROUTE_Y = 32

/** Column shares: Raw 42%, Developing 33%, In Production 25%. */
const NODE_X = {
  ideas: VIEW_W * 0.21,
  developing: VIEW_W * 0.585,
  production: VIEW_W * 0.875,
} as const

function buildWorkflowPath() {
  const y = ROUTE_Y
  const raw = NODE_X.ideas
  const developing = NODE_X.developing
  const production = NODE_X.production

  return [
    `M 48 ${y + 2}`,
    `C 34 ${y - 16} 78 ${y - 20} 96 ${y - 4}`,
    `C 108 ${y + 8} 74 ${y + 16} 82 ${y + 2}`,
    `C 88 ${y - 6} 140 ${y} ${raw} ${y}`,
    `C ${raw + 90} ${y - 10} ${developing - 90} ${y + 9} ${developing} ${y}`,
    `C ${developing + 70} ${y - 7} ${production - 70} ${y + 5} ${production} ${y}`,
    `C ${production + 28} ${y - 3} 948 ${y - 12} 972 14`,
  ].join(" ")
}

const ROUTE_PATH = buildWorkflowPath()

function buildPromotePath() {
  const y = ROUTE_Y
  return `M ${NODE_X.ideas} ${y} C ${NODE_X.ideas + 80} ${y - 12} ${NODE_X.developing - 80} ${y + 8} ${NODE_X.developing} ${y}`
}

export function WorkflowRoute({
  promoting = false,
  pulseDeveloping = false,
}: {
  promoting?: boolean
  pulseDeveloping?: boolean
}) {
  return (
    <div className="workflow-route" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <marker
            id="workflow-arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M1 1.1 10.8 6 1 10.9Z" fill="var(--route-blue)" />
          </marker>
        </defs>
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="var(--route-blue)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          markerEnd="url(#workflow-arrowhead)"
        />
        {promoting ? (
          <path
            className="promote-travel"
            d={buildPromotePath()}
            fill="none"
            stroke="var(--route-blue)"
            strokeWidth="4.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
          />
        ) : null}
      </svg>
      {(
        [
          ["ideas", NODE_X.ideas],
          ["developing", NODE_X.developing],
          ["production", NODE_X.production],
        ] as const
      ).map(([stage, x]) => (
        <span
          key={stage}
          className="workflow-node"
          data-stage={stage}
          data-pulse={
            pulseDeveloping && stage === "developing" ? "true" : undefined
          }
          style={{ left: `${(x / VIEW_W) * 100}%` }}
        />
      ))}
    </div>
  )
}
