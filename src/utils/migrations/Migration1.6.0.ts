import { IBuild } from '../../models/build/IBuild'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IMigration } from '../../models/utils/IMigration'
import { ItemService } from '../../services/ItemService'
import { VersionService } from '../../services/VersionService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../Result'

/**
 * Represents a migration updates obsolete builds to use the default preset item instead of the base item for their weapons.
 */
export class Migration160 implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<Result<void>> => Promise.resolve(Result.ok())
  public version = '1.6.0'

  private async executeBuildMigration(build: IBuild): Promise<Result> {
    const versionService = Services.get(VersionService)
    const itemService = Services.get(ItemService)

    let hasFailed = false

    if (versionService.compareVersions(build.lastWebsiteVersion, this.version) >= 0) {
      return Result.ok()
    }

    for (const inventorySlot of build.inventorySlots) {
      if (inventorySlot.typeId !== 'onSling' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'holster') {
        continue
      }

      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == null) {
          continue
        }

        const itemResult = await itemService.getItem(inventoryItem.itemId)

        if (!itemResult.success) {
          hasFailed = true
          continue
        }

        const rangedWeapon = itemResult.value as IRangedWeapon

        if (rangedWeapon.defaultPresetId != null) {
          inventoryItem.itemId = rangedWeapon.defaultPresetId
        }
      }
    }

    return hasFailed
      ? Result.fail(FailureType.error)
      : Result.ok()
  }
}