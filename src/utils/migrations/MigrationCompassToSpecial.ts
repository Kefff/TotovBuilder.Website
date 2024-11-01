import { IBuild } from '../../models/build/IBuild'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { IMigration } from '../../models/utils/IMigration'

/**
 * Represents a migration that replaces the compass inventory slot by the special inventory slots in obsolete builds.
 */
export class MigrationCompassToSpecial implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<boolean> => Promise.resolve(true)
  public version = undefined

  private executeBuildMigration(build: IBuild): Promise<boolean> {
    const obsoleteInventorySlot = build.inventorySlots.find(is => is.typeId === 'compass' as InventorySlotTypeId)

    if (obsoleteInventorySlot != null) {
      obsoleteInventorySlot.typeId = InventorySlotTypeId.special
      obsoleteInventorySlot.items = [
        obsoleteInventorySlot.items[0],
        undefined,
        undefined
      ]
    }

    return Promise.resolve(true)
  }
}