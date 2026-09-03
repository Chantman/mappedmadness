import { EmptyState } from "@/components/empty/empty-state"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { useWorkshop } from "@/state/workshop-store"

export function InventoryPage() {
  const { inventory } = useWorkshop()

  return (
    <div className="max-w-6xl">
      <p className="text-[14px] text-muted-foreground">Bench</p>
      <h1 className="font-heading mt-1 text-[32px]">Inventory</h1>
      <p className="mt-2 mb-6 max-w-2xl text-[16px] leading-7 text-muted-foreground">
        Quantity on the shelf is not quantity you can spend. Available and reserved stay apart.
      </p>
      {inventory.length === 0 ? (
        <EmptyState
          title="No parts recorded"
          body="Parts live here once they have been counted on the bench."
        />
      ) : (
        <InventoryTable items={inventory} />
      )}
    </div>
  )
}
