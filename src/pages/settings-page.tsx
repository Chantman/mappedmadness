import { Button } from "@/components/ui/button"
import { useWorkshop } from "@/state/workshop-store"

export function SettingsPage() {
  const { resetLocalData } = useWorkshop()

  return (
    <div className="max-w-xl">
      <p className="text-[14px] text-muted-foreground">Studio</p>
      <h1 className="font-heading mt-1 text-[32px]">Settings</h1>
      <p className="mt-2 text-[16px] leading-7 text-muted-foreground">
        Brand choice, idea ranking and board changes are stored in this browser.
        Nothing is synced yet.
      </p>
      <div className="mt-8">
        <Button variant="outline" onClick={resetLocalData}>
          Reset board to sample data
        </Button>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Restores the seed ideas and projects. Does not touch inventory.
        </p>
      </div>
    </div>
  )
}
