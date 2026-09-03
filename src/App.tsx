import { AppShell } from "@/components/layout/app-shell"
import { TooltipProvider } from "@/components/ui/tooltip"
import { WorkshopProvider } from "@/state/workshop-store"

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <WorkshopProvider>
        <AppShell />
      </WorkshopProvider>
    </TooltipProvider>
  )
}
