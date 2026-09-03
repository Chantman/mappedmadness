import { PartThumb } from "@/components/inventory/part-thumb"
import { ConfidenceMark } from "@/components/status/confidence-mark"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { categoryCopy } from "@/data/catalog"
import { projectNameById, reservedCaption } from "@/data/selectors"
import type { InventoryItem } from "@/data/types"
import { formatAmount } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useWorkshop } from "@/state/workshop-store"

function StockCell({
  value,
  item,
  emptyTone,
}: {
  value: number
  item: InventoryItem
  emptyTone?: boolean
}) {
  const empty = emptyTone && value <= 0
  const uncertain = item.confidence === "uncertain"

  return (
    <span
      className={cn(
        "text-[14px] tabular-nums",
        empty ? "text-blocked" : uncertain ? "text-uncertain" : "text-foreground",
      )}
    >
      {formatAmount(value, item)}
    </span>
  )
}

export function InventoryTable({
  items,
  className,
}: {
  items: InventoryItem[]
  className?: string
}) {
  const { projects } = useWorkshop()
  const names = projectNameById(projects)

  return (
    <div className={cn("overflow-hidden rounded-[10px] border border-border bg-surface", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">
              Part
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-[13px] font-medium text-muted-foreground">
              Qty
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-[13px] font-medium text-muted-foreground">
              Available
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-[13px] font-medium text-muted-foreground">
              Reserved
            </TableHead>
            <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">
              Location
            </TableHead>
            <TableHead className="h-11 px-4 text-[13px] font-medium text-muted-foreground">
              Confidence
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={cn(
                "border-border",
                item.available <= 0 && "bg-blocked/5",
              )}
            >
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <PartThumb category={item.category} />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] text-foreground">
                      {item.name}
                    </div>
                    <div className="truncate text-[13px] text-muted-foreground">
                      {categoryCopy[item.category]}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <StockCell value={item.quantity} item={item} />
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <StockCell value={item.available} item={item} emptyTone />
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <span
                  className={cn(
                    "text-[14px] tabular-nums",
                    item.reserved > 0
                      ? "text-muted-foreground"
                      : "text-dim",
                  )}
                >
                  {item.reserved > 0 ? formatAmount(item.reserved, item) : "—"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-[14px] text-muted-foreground">
                {item.location}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <ConfidenceMark confidence={item.confidence} />
                  {item.reserved > 0 ? (
                    <span
                      className="truncate text-[12px] text-dim"
                      title={reservedCaption(item, names)}
                    >
                      {reservedCaption(item, names)}
                    </span>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
