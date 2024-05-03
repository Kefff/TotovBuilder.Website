import { IBuild } from '../../models/build/IBuild'
import { IMigration } from '../../models/utils/IMigration'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import Result from '../Result'

/**
 * Represents a migration updates obsolete builds to use the default preset item instead of the base item for their armored items.
 */
export class Migration171 implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<Result<void>> => Promise.resolve(Result.ok())
  public version = '1.7.1'

  private async executeBuildMigration(build: IBuild): Promise<boolean> {
    const itemService = Services.get(ItemService)
    let success = false

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== 'bodyArmor' && inventorySlot.typeId !== 'headwear' && inventorySlot.typeId !== 'tacticalRig') {
        continue
      }

      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == null) {
          continue
        }

        const item = await itemService.getItem(inventoryItem.itemId)

        if (item == null) {
          success = false

          continue
        }

        const itemsOfCategory = await itemService.getItemsOfCategories([item.categoryId], false)

        if (itemsOfCategory.length === 0) {
          success = false

          continue
        }

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