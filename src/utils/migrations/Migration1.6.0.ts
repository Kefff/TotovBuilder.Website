import { IBuild } from '../../models/build/IBuild'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { ItemCategoryId } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IMigration } from '../../models/utils/IMigration'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'

/**
 * Represents a migration that updates obsolete builds to use the default preset item instead of the base item for their weapons.
 */
export class Migration160 implements IMigration {
  public migrateBuildPromise = this.executeBuildMigrationAsync
  public migrateBuildUnrelatedDataPromise = (): Promise<boolean> => Promise.resolve(true)
  public version = '1.6.0'

  private async executeBuildMigrationAsync(build: IBuild): Promise<boolean> {
    const itemService = Services.get(ItemService)
    let success = true

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== InventorySlotTypeId.onSling
        && inventorySlot.typeId !== InventorySlotTypeId.onBack
        && inventorySlot.typeId !== InventorySlotTypeId.holster) {
        continue
      }

      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == null) {
          continue
        }

        const item = await itemService.getItemAsync(inventoryItem.itemId)

        if (item.categoryId === ItemCategoryId.notFound) {
          success = false
        }

        const rangedWeapon = item as IRangedWeapon

        if (rangedWeapon.defaultPresetId != null) {
          inventoryItem.itemId = rangedWeapon.defaultPresetId
        }
      }
    }

    return success
  }
}