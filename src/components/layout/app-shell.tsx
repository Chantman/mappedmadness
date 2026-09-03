import { useState } from "react"

import { ScribbleBackdrop } from "@/components/branding/ScribbleBackdrop"
import { QuickCapture } from "@/components/capture/quick-capture"
import { MobileNav, Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { CompletedPage } from "@/pages/completed-page"
import { InventoryPage } from "@/pages/inventory-page"
import { SearchPage } from "@/pages/search-page"
import { SettingsPage } from "@/pages/settings-page"
import { WorkspacePage } from "@/pages/workspace-page"
import { useWorkshop } from "@/state/workshop-store"

export function AppShell() {
  const { view, brandId } = useWorkshop()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="app-shell flex min-h-dvh min-w-0 bg-background" data-brand={brandId}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <div className="shell-main flex min-h-dvh min-w-0 flex-1 flex-col">
        <ScribbleBackdrop variant="workspace" />
        <TopBar onOpenNav={() => setMobileNavOpen(true)} />
        <main
          id="main"
          className={
            view === "workspace"
              ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip px-3 pb-3 md:px-4 lg:px-6"
              : "min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-auto px-4 pb-8 lg:px-8"
          }
        >
          {view === "workspace" ? <WorkspacePage /> : null}
          {view === "inventory" ? <InventoryPage /> : null}
          {view === "completed" ? <CompletedPage /> : null}
          {view === "search" ? <SearchPage /> : null}
          {view === "settings" ? <SettingsPage /> : null}
        </main>
      </div>
      <QuickCapture />
    </div>
  )
}
