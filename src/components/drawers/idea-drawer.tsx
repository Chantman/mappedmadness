import { ArrowRight } from "lucide-react"

import { StageMedia } from "@/components/media/stage-media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { Idea, RankingScores } from "@/data/types"
import { formatCaptured, formatHours, formatUsd } from "@/lib/format"
import { partsOwnedPercent, toDifficulty, toSimplicity } from "@/lib/metrics"
import { useWorkshop } from "@/state/workshop-store"

const scoreFields: {
  key: keyof RankingScores
  label: string
  mode: "score" | "difficulty" | "percent"
}[] = [
  { key: "viralPotential", label: "Viral potential", mode: "score" },
  { key: "simplicity", label: "Difficulty", mode: "difficulty" },
  { key: "partsCoverage", label: "Parts on Hand", mode: "percent" },
  { key: "profitability", label: "Profitability", mode: "score" },
  { key: "contentPotential", label: "Content potential", mode: "score" },
  { key: "brandFit", label: "Brand fit", mode: "score" },
  { key: "seasonalUrgency", label: "Seasonal urgency", mode: "score" },
  { key: "excitement", label: "Excitement", mode: "score" },
  { key: "readiness", label: "Readiness", mode: "score" },
]

export function IdeaDrawer({
  idea,
  open,
  onOpenChange,
  onPromote,
}: {
  idea: Idea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPromote: (id: string) => void
}) {
  const { updateIdea } = useWorkshop()

  if (!idea) return null

  const current = idea

  function patchScore(key: keyof RankingScores, value: number) {
    const next = Math.min(10, Math.max(1, value))
    updateIdea(current.id, { scores: { ...current.scores, [key]: next } })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-[18px]">{current.title}</SheetTitle>
          <SheetDescription>
            Captured {formatCaptured(current.capturedAt)}. Viral and difficulty
            use 1–10; parts on hand is a percentage.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 p-4">
          {current.imageUrl ? (
            <div className="media-frame aspect-video overflow-hidden rounded-md">
              <img
                src={current.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="media-frame overflow-hidden rounded-md">
              <StageMedia
                visualId={current.visualId}
                label={current.title}
                className="aspect-video h-auto"
              />
            </div>
          )}
          <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
            Concept
            <Textarea
              value={current.concept}
              onChange={(event) =>
                updateIdea(current.id, { concept: event.target.value })
              }
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
              Estimated cost
              <Input
                type="number"
                value={current.estimatedCost}
                onChange={(event) =>
                  updateIdea(current.id, {
                    estimatedCost: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
              Estimated hours
              <Input
                type="number"
                value={current.estimatedHours}
                onChange={(event) =>
                  updateIdea(current.id, {
                    estimatedHours: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
          <div className="text-[12px] text-dim">
            {formatUsd(current.estimatedCost)} · {formatHours(current.estimatedHours)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {scoreFields.map((field) => {
              const stored = current.scores[field.key]
              const display =
                field.mode === "difficulty"
                  ? toDifficulty(stored)
                  : field.mode === "percent"
                    ? partsOwnedPercent(stored)
                    : stored
              const min = field.mode === "percent" ? 0 : 1
              const max = field.mode === "percent" ? 100 : 10

              return (
                <label
                  key={field.key}
                  className="flex flex-col gap-1 text-[12px] text-muted-foreground"
                >
                  {field.label}
                  {field.mode === "percent" ? " (%)" : ""}
                  <Input
                    className="tabular-nums"
                    type="number"
                    min={min}
                    max={max}
                    value={display}
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      if (field.mode === "difficulty") {
                        const difficulty = Math.min(10, Math.max(1, next))
                        patchScore(field.key, toSimplicity(difficulty))
                        return
                      }
                      if (field.mode === "percent") {
                        const coverage = Math.min(10, Math.max(0, next / 10))
                        updateIdea(current.id, {
                          scores: { ...current.scores, partsCoverage: coverage },
                        })
                        return
                      }
                      patchScore(field.key, next)
                    }}
                  />
                </label>
              )
            })}
          </div>
        </div>
        <SheetFooter>
          <Button
            className="h-10"
            onClick={() => {
              onPromote(current.id)
              onOpenChange(false)
            }}
          >
            Promote
            <ArrowRight />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
