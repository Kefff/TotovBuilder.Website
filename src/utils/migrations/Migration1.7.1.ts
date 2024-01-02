import { IMigration } from '../../models/utils/IMigration'
import Services from '../../services/repository/Services'
import { IBuild } from '../../models/build/IBuild'
import { ItemService } from '../../services/ItemService'
import Result, { FailureType } from '../Result'

/**
 * Represents a migration updates obsolete builds to use the default preset item instead of the base item for their armored items.
 */
export class Migration171 implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<Result<void>> => Promise.resolve(Result.ok())
  public version = '1.7.1'

  private async executeBuildMigration(build: IBuild): Promise<Result> {
    const itemService = Services.get(ItemService)

    let hasFailed = false
    const errorMessages: string[] = []

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== 'bodyArmor' && inventorySlot.typeId !== 'headwear' && inventorySlot.typeId !== 'tacticalRig') {
        continue
      }

      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == null) {
          continue
        }

        const itemResult = await itemService.getItem(inventoryItem.itemId)

        if (!itemResult.success) {
          errorMessages.push(itemResult.failureMessage)
          hasFailed = true

          continue
        }

        const itemsOfCategoryResult = await itemService.getItemsOfCategories([itemResult.value.categoryId], false)

        if (!itemsOfCategoryResult.success) {
          errorMessages.push(itemsOfCategoryResult.failureMessage)
          hasFailed = true

          continue
        }

        const preset = itemsOfCategoryResult.value.filter(v => v.name === itemResult.value.name + ' Default')[0]

        if (preset == null) {
          continue
        }

        inventoryItem.itemId = preset.id
      }
    }

    return hasFailed
      ? Result.fail(FailureType.error, 'Migration171.executeBuildMigration()', errorMessages.join('\n'))
      : Result.ok()
  }
}