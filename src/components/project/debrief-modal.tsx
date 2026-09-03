import { useState, type ReactNode } from "react"

import { CopyButton } from "@/components/actions/copy-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { emptyDebrief } from "@/data/types"
import type { Project, ProjectDebrief } from "@/data/types"
import { composeDebriefPrompt } from "@/lib/prompts"
import { useWorkshop } from "@/state/workshop-store"

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
      {label}
      {children}
    </label>
  )
}

export function DebriefForm({
  project,
  onSaved,
}: {
  project: Project
  onSaved?: () => void
}) {
  const { saveDebrief } = useWorkshop()
  const [draft, setDraft] = useState<ProjectDebrief>(
    project.debrief ?? {
      ...emptyDebrief(),
      actualCost: project.actualCost ?? 0,
      actualBuildTimeHours: project.actualBuildTimeHours ?? 0,
    },
  )

  function patch<K extends keyof ProjectDebrief>(key: K, value: ProjectDebrief[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-4">
      <CopyButton
        label="Copy Debrief Prompt"
        text={composeDebriefPrompt({ ...project, debrief: draft })}
      />
      <div className="grid gap-3">
        <Field label="What was built?">
          <Textarea value={draft.whatWasBuilt} onChange={(e) => patch("whatWasBuilt", e.target.value)} />
        </Field>
        <Field label="What changed from the original concept?">
          <Textarea value={draft.whatChanged} onChange={(e) => patch("whatChanged", e.target.value)} />
        </Field>
        <Field label="What technical approach worked?">
          <Textarea value={draft.technicalApproach} onChange={(e) => patch("technicalApproach", e.target.value)} />
        </Field>
        <Field label="What failed?">
          <Textarea value={draft.whatFailed} onChange={(e) => patch("whatFailed", e.target.value)} />
        </Field>
        <Field label="What parts were consumed?">
          <Textarea value={draft.partsConsumed} onChange={(e) => patch("partsConsumed", e.target.value)} />
        </Field>
        <Field label="What content was published?">
          <Textarea value={draft.contentPublished} onChange={(e) => patch("contentPublished", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Actual cost">
            <Input
              type="number"
              value={draft.actualCost}
              onChange={(e) => patch("actualCost", Number(e.target.value))}
            />
          </Field>
          <Field label="Actual build time (hours)">
            <Input
              type="number"
              value={draft.actualBuildTimeHours}
              onChange={(e) => patch("actualBuildTimeHours", Number(e.target.value))}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Views">
            <Input type="number" value={draft.views ?? ""} onChange={(e) => patch("views", Number(e.target.value) || undefined)} />
          </Field>
          <Field label="Shares">
            <Input type="number" value={draft.shares ?? ""} onChange={(e) => patch("shares", Number(e.target.value) || undefined)} />
          </Field>
          <Field label="Saves">
            <Input type="number" value={draft.saves ?? ""} onChange={(e) => patch("saves", Number(e.target.value) || undefined)} />
          </Field>
          <Field label="Followers gained">
            <Input type="number" value={draft.followersGained ?? ""} onChange={(e) => patch("followersGained", Number(e.target.value) || undefined)} />
          </Field>
          <Field label="Purchase or commission inquiries">
            <Input type="number" value={draft.inquiries ?? ""} onChange={(e) => patch("inquiries", Number(e.target.value) || undefined)} />
          </Field>
          <Field label="Revenue">
            <Input type="number" value={draft.revenue ?? ""} onChange={(e) => patch("revenue", Number(e.target.value) || undefined)} />
          </Field>
        </div>
        <Field label="Best-performing hook">
          <Input value={draft.bestPerformingHook ?? ""} onChange={(e) => patch("bestPerformingHook", e.target.value)} />
        </Field>
        <Field label="What should be repeated?">
          <Textarea value={draft.whatToRepeat} onChange={(e) => patch("whatToRepeat", e.target.value)} />
        </Field>
        <Field label="What should be avoided?">
          <Textarea value={draft.whatToAvoid} onChange={(e) => patch("whatToAvoid", e.target.value)} />
        </Field>
        <Field label="Is it worth building again?">
          <Input value={draft.worthBuildingAgain} onChange={(e) => patch("worthBuildingAgain", e.target.value)} />
        </Field>
        <Field label="Commercial potential">
          <Textarea value={draft.commercialPotential} onChange={(e) => patch("commercialPotential", e.target.value)} />
        </Field>
        <Field label="Additional notes">
          <Textarea value={draft.additionalNotes} onChange={(e) => patch("additionalNotes", e.target.value)} />
        </Field>
        <Field label="Project Intelligence (paste later)">
          <Textarea
            className="min-h-32"
            value={draft.intelligence ?? ""}
            onChange={(e) => patch("intelligence", e.target.value)}
            placeholder="Paste analysis here when you have it. Do not generate fake results in this field."
          />
        </Field>
      </div>
      <Button
        onClick={() => {
          saveDebrief(project.id, draft)
          onSaved?.()
        }}
      >
        Save debrief
      </Button>
    </div>
  )
}
