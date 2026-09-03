import { PanelLeft, Settings } from "lucide-react"

import { MappedMadnessMark } from "@/components/branding/MappedMadnessMark"
import { ScribbleBackdrop } from "@/components/branding/ScribbleBackdrop"
import { BrandSwitch } from "@/components/brand/brand-switch"
import { primaryNavItems } from "@/components/layout/nav-items"
import {
  HandwrittenAnnotation,
  SidebarScribbles,
} from "@/components/studio/primitives"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

export function Sidebar({
  className,
  onNavigate,
  forceExpanded = false,
}: {
  className?: string
  onNavigate?: () => void
  forceExpanded?: boolean
}) {
  const { view, setView, sidebarCollapsed, setSidebarCollapsed } = useWorkshop()
  const collapsed = forceExpanded ? false : sidebarCollapsed

  return (
    <aside
      data-drawer={forceExpanded ? "true" : undefined}
      data-collapsed={collapsed ? "true" : undefined}
      className={cn(
        "shell-sidebar shrink-0 bg-sidebar text-sidebar-foreground",
        collapsed ? "w-[72px]" : "w-[248px]",
        className,
      )}
    >
      <ScribbleBackdrop variant="sidebar" />
      <SidebarScribbles />
      <div className="sidebar-veil" aria-hidden="true" />
      <span className="sidebar-torn" aria-hidden="true" />

      <div className="sidebar-chrome">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "h-[68px] justify-center px-2" : "h-[68px] px-3",
          )}
        >
          <MappedMadnessMark className="sidebar-logo" title="Mapped Madness" />
          {collapsed ? null : (
            <div className="min-w-0">
              <div className="font-heading truncate text-[16px] leading-5">
                Mapped Madness
              </div>
              <div className="sidebar-subtitle text-[12px] leading-4 text-sidebar-muted">
                Creative operating system
              </div>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-1 px-2" aria-label="Primary">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => {
                  setView(item.id)
                  onNavigate?.()
                }}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-left text-[15px] transition-colors duration-150",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-sidebar-selected text-sidebar-selected-fg"
                    : "text-sidebar-muted hover:bg-sidebar-raised hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.7} />
                {collapsed ? (
                  <span className="sr-only">{item.label}</span>
                ) : (
                  item.label
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-spacer relative">
          {collapsed ? null : (
            <>
              <HandwrittenAnnotation
                className="absolute top-6 left-3 max-w-[210px] text-[17px] text-[#f4eee0]"
                rotate={-6}
              >
                IDEAS → IMPACT → PRODUCTS
              </HandwrittenAnnotation>
              <HandwrittenAnnotation
                className="absolute bottom-4 left-2 max-w-[220px] text-[34px] leading-none"
                rotate={-8}
              >
                MAKE WAVES
              </HandwrittenAnnotation>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          {forceExpanded ? (
            <div className="mb-3">
              <BrandSwitch />
            </div>
          ) : null}

          <button
            type="button"
            title="Settings"
            onClick={() => {
              setView("settings")
              onNavigate?.()
            }}
            className={cn(
              "flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[15px] transition-colors duration-150",
              collapsed && "justify-center px-0",
              view === "settings"
                ? "bg-sidebar-selected text-sidebar-selected-fg"
                : "text-sidebar-muted hover:bg-sidebar-raised hover:text-sidebar-foreground",
            )}
          >
            <Settings className="size-4 shrink-0" strokeWidth={1.7} />
            {collapsed ? <span className="sr-only">Settings</span> : "Settings"}
          </button>

          {forceExpanded ? null : (
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 w-full text-sidebar-muted hover:bg-sidebar-raised hover:text-sidebar-foreground"
              onClick={() => setSidebarCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft />
            </Button>
          )}

          {collapsed ? null : (
            <p className="sidebar-version">Mapped Madness · Local</p>
          )}
        </div>
      </div>
    </aside>
  )
}

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[248px] bg-sidebar p-0 sm:max-w-[248px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <Sidebar
          forceExpanded
          onNavigate={() => onOpenChange(false)}
          className="flex h-full w-full"
        />
      </SheetContent>
    </Sheet>
  )
}
