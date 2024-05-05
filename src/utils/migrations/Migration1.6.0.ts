import { IBuild } from '../../models/build/IBuild'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IMigration } from '../../models/utils/IMigration'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'

/**
 * Represents a migration updates obsolete builds to use the default preset item instead of the base item for their weapons.
 */
export class Migration160 implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<boolean> => Promise.resolve(true)
  public version = '1.6.0'

  private async executeBuildMigration(build: IBuild): Promise<boolean> {
    const itemService = Services.get(ItemService)
    let success = true

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== 'onSling' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'holster') {
        continue
      }

      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == null) {
          continue
        }

        try {
          const item = await itemService.getItem(inventoryItem.itemId)
          const rangedWeapon = item as IRangedWeapon

          if (rangedWeapon.defaultPresetId != null) {
            inventoryItem.itemId = rangedWeapon.defaultPresetId
          }
        }
        catch {
          success = false

          continue
        }
      }
    }

    return success
  }
}