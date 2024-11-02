import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IMigration } from '../../models/utils/IMigration'

/**
 * Represents a migration updates obsolete builds that contain weapons with a chamber.
 */
export class Migration181 implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<boolean> => Promise.resolve(true)
  public version = '1.8.1'

  private executeBuildMigration(build: IBuild): Promise<boolean> {
    for (const inventorySlot of build.inventorySlots) {
      for (const inventoryItem of inventorySlot.items) {
        this.removeChamber(inventoryItem)
      }
    }

    return Promise.resolve(true)
  }

  private removeChamber(inventoryItem?: IInventoryItem): void {
    if (inventoryItem == null) {
      return
    }

    const chamberIndex = inventoryItem.modSlots.findIndex(ms => ms.modSlotName.startsWith('chamber'))

    if (chamberIndex >= 0) {
      inventoryItem.modSlots.splice(chamberIndex, 1)
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      this.removeChamber(modSlot.item)
    }

    for (const containedItem of inventoryItem.content) {
      this.removeChamber(containedItem)
    }
  }
}