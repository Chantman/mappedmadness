import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ImageDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (url: string) => void
}) {
  const [url, setUrl] = useState("")
  const id = useId()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Concept image</DialogTitle>
          <DialogDescription>
            Paste a URL or choose a local file. This stays on this machine.
          </DialogDescription>
        </DialogHeader>
        <label className="text-[13px] text-muted-foreground" htmlFor={`${id}-url`}>
          Image URL
        </label>
        <Input
          id={`${id}-url`}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://"
        />
        <label className="text-[13px] text-muted-foreground">
          Local file
          <Input
            className="mt-2"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              onSave(URL.createObjectURL(file))
              onOpenChange(false)
            }}
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!url.trim()}
            onClick={() => {
              onSave(url.trim())
              onOpenChange(false)
            }}
          >
            Use URL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PartsDialog({
  open,
  onOpenChange,
  owned,
  missing,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  owned: string[]
  missing: string[]
  onSave: (next: { partsOwned: string[]; partsMissing: string[] }) => void
}) {
  const [ownedText, setOwnedText] = useState(owned.join("\n"))
  const [missingText, setMissingText] = useState(missing.join("\n"))

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setOwnedText(owned.join("\n"))
          setMissingText(missing.join("\n"))
        }
        onOpenChange(next)
      }}
    >
      <DialogContent className="gap-4 sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Parts</DialogTitle>
          <DialogDescription>
            One part per line. Owned and missing stay separate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-[13px] text-muted-foreground">
            Already owned
            <Textarea
              className="mt-2 min-h-40"
              value={ownedText}
              onChange={(event) => setOwnedText(event.target.value)}
            />
          </label>
          <label className="text-[13px] text-muted-foreground">
            Believed missing
            <Textarea
              className="mt-2 min-h-40"
              value={missingText}
              onChange={(event) => setMissingText(event.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                partsOwned: ownedText.split("\n").map((line) => line.trim()).filter(Boolean),
                partsMissing: missingText.split("\n").map((line) => line.trim()).filter(Boolean),
              })
              onOpenChange(false)
            }}
          >
            Save parts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
