const VIEW_W = 1000
const VIEW_H = 64
const ROUTE_Y = 36

/** Column shares: Raw 42%, Developing 33%, In Production 25%. */
const NODE_X = {
  ideas: VIEW_W * 0.21,
  developing: VIEW_W * 0.585,
  production: VIEW_W * 0.875,
} as const

function buildSegment(
  start: string,
  through: string,
  end: string,
) {
  return `${start} ${through} ${end}`
}

const START_PATH = buildSegment(
  `M 32 ${ROUTE_Y + 4}`,
  `C 14 ${ROUTE_Y - 22} 68 ${ROUTE_Y - 26} 86 ${ROUTE_Y - 6} C 98 ${ROUTE_Y + 10} 58 ${ROUTE_Y + 20} 70 ${ROUTE_Y + 2} C 80 ${ROUTE_Y - 10} 140 ${ROUTE_Y + 2}`,
  `${NODE_X.ideas} ${ROUTE_Y}`,
)

const MID_PATH = `M ${NODE_X.ideas} ${ROUTE_Y} C ${NODE_X.ideas + 70} ${ROUTE_Y - 16} ${NODE_X.developing - 80} ${ROUTE_Y + 14} ${NODE_X.developing} ${ROUTE_Y}`

const END_PATH = `M ${NODE_X.developing} ${ROUTE_Y} C ${NODE_X.developing + 64} ${ROUTE_Y - 10} ${NODE_X.production - 54} ${ROUTE_Y + 11} ${NODE_X.production} ${ROUTE_Y} C ${NODE_X.production + 26} ${ROUTE_Y - 4} 952 ${ROUTE_Y - 16} 978 16`

function buildPromotePath() {
  return MID_PATH
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
            <path d="M1 1.1 10.8 6 1 10.9Z" fill="var(--coral)" />
          </marker>
        </defs>
        <path
          d={START_PATH}
          fill="none"
          stroke="var(--cobalt)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={MID_PATH}
          fill="none"
          stroke="var(--chartreuse)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={END_PATH}
          fill="none"
          stroke="var(--coral)"
          strokeWidth="3.8"
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
            stroke="var(--cobalt)"
            strokeWidth="4.6"
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
