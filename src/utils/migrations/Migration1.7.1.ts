import { IBuild } from '../../models/build/IBuild'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { ItemCategoryId } from '../../models/item/IItem'
import { IMigration } from '../../models/utils/IMigration'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'

/**
 * Represents a migration that updates obsolete builds to use the default preset item instead of the base item for their armored items.
 */
export class Migration171 implements IMigration {
  public migrateBuildPromise = this.executeBuildMigrationAsync
  public migrateBuildUnrelatedDataPromise = (): Promise<boolean> => Promise.resolve(true)
  public version = '1.7.1'

  private async executeBuildMigrationAsync(build: IBuild): Promise<boolean> {
    const itemService = Services.get(ItemService)
    let success = true

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== InventorySlotTypeId.bodyArmor
        && inventorySlot.typeId !== InventorySlotTypeId.headwear
        && inventorySlot.typeId !== InventorySlotTypeId.tacticalRig) {
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

        const itemsOfCategory = await itemService.getItemsOfCategoriesAsync([item.categoryId], false)
        const preset = itemsOfCategory.filter(v => v.name === item.name + ' Default')[0]

        if (preset == null) {
          continue
        }

        inventoryItem.itemId = preset.id
      }
    }

    return success
  }
}