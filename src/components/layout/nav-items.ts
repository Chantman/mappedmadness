import { Box, LayoutGrid, Search, Settings } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

import { CheckeredFlag } from "@/components/branding/CheckeredFlag"
import type { AppView } from "@/data/types"

type NavIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>

export const navItems: { id: AppView; label: string; icon: NavIcon }[] = [
  { id: "workspace", label: "Workspace", icon: LayoutGrid },
  { id: "inventory", label: "Inventory", icon: Box },
  { id: "completed", label: "Completed", icon: CheckeredFlag },
  { id: "search", label: "Search", icon: Search },
  { id: "settings", label: "Settings", icon: Settings },
]

export const primaryNavItems = navItems.filter((item) => item.id !== "settings")
