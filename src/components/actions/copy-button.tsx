import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { copyText } from "@/lib/format"

export function CopyButton({
  text,
  label,
  copiedLabel = "Copied",
}: {
  text: string
  label: string
  copiedLabel?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 text-[14px]"
      onClick={() => {
        void copyText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        })
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? copiedLabel : label}
    </Button>
  )
}
