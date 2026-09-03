import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Kbd } from "@/components/ui/kbd"
import { modifierLabel } from "@/lib/hotkey"
import { useWorkshop } from "@/state/workshop-store"

function splitCapture(body: string) {
  const lines = body.trim().split("\n")
  const title = lines[0]?.trim() ?? ""
  const concept = lines.slice(1).join(" ").trim() || title
  return { title, concept }
}

export function QuickCapture() {
  const { captureOpen, setCaptureOpen, capturePrefill } = useWorkshop()

  return (
    <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
      {captureOpen ? <QuickCaptureBody initialBody={capturePrefill} /> : null}
    </Dialog>
  )
}

function QuickCaptureBody({ initialBody }: { initialBody: string }) {
  const { setCaptureOpen, addIdea, setView } = useWorkshop()
  const [body, setBody] = useState(initialBody)
  const titleId = useId()

  function close() {
    setCaptureOpen(false)
  }

  function submit() {
    const { title, concept } = splitCapture(body)
    if (!title) return
    addIdea({ title, concept })
    close()
    setView("workspace")
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="top-[18%] translate-y-0 gap-0 rounded-[10px] p-0 sm:max-w-[560px]"
      aria-labelledby={titleId}
    >
      <DialogHeader className="px-5 py-4">
        <DialogTitle id={titleId} className="text-[18px] font-medium">
          Capture an idea
        </DialogTitle>
        <DialogDescription className="text-[14px] leading-6">
          First line becomes the title. The rest is the concept. It lands in the
          current brand inbox.
        </DialogDescription>
      </DialogHeader>

      <div className="px-5 pb-2">
        <Textarea
          autoFocus
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="Ocean tide clock&#10;A desk clock whose face fills with a slow swell at high tide."
          className="min-h-[160px] resize-none rounded-md border-0 bg-transparent px-1 py-1 text-[16px] leading-7 focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-[13px] text-muted-foreground">
          Saved to the open brand
          <Kbd className="ml-2">
            {modifierLabel() === "⌘" ? "⌘↵" : "Ctrl+Enter"}
          </Kbd>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button className="h-10 px-4 text-[15px]" onClick={submit} disabled={!body.trim()}>
            Capture
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
