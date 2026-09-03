import { useEffect } from "react"
import { Menu, Settings } from "lucide-react"

import { MappedMadnessMark } from "@/components/branding/MappedMadnessMark"
import { BrandSwitch } from "@/components/brand/brand-switch"
import { primaryNavItems } from "@/components/layout/nav-items"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { brandById } from "@/data/catalog"
import { modifierLabel } from "@/lib/hotkey"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const { openCapture, setView, view, brandId } = useWorkshop()
  const brand = brandById[brandId]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        openCapture()
      }

      if (event.key === "/" && !typing) {
        event.preventDefault()
        setView("search")
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openCapture, setView])

  return (
    <header className="app-topbar">
      <Button
        variant="ghost"
        size="icon"
        className="topbar-menu"
        onClick={onOpenNav}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>

      <div className="topbar-lockup min-w-0">
        <MappedMadnessMark className="sidebar-logo" title="Mapped Madness" />
        <div className="min-w-0">
          <div className="font-heading truncate text-[16px] leading-5">
            Mapped Madness
          </div>
          <div className="topbar-subtitle truncate text-[12px] leading-4 text-muted-foreground">
            Creative operating system
          </div>
        </div>
      </div>

      <nav className="topbar-inline-nav" aria-label="Primary">
        {primaryNavItems.map((item) => {
          const Icon = item.icon
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0" strokeWidth={1.8} />
              <span className="topbar-nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {view === "workspace" ? (
        <div className="topbar-brand-identity min-w-0 flex-1">
          <h1 className="font-heading truncate text-[22px] leading-6">
            {brand.name}
          </h1>
          <p className="truncate text-[12px] text-muted-foreground">
            {brand.descriptor}
          </p>
        </div>
      ) : (
        <div className="topbar-brand-identity flex-1" />
      )}

      <div className="topbar-actions">
        <BrandSwitch />
        <Button className="h-9 shrink-0 px-3 text-[14px]" onClick={() => openCapture()}>
          Capture
          <Kbd className="topbar-capture-kbd ml-2 border-0 bg-primary-foreground/15 text-primary-foreground">
            {modifierLabel() === "⌘" ? "⌘K" : "Ctrl K"}
          </Kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="topbar-settings"
          onClick={() => setView("settings")}
          aria-label="Settings"
        >
          <Settings />
        </Button>
      </div>
    </header>
  )
}
