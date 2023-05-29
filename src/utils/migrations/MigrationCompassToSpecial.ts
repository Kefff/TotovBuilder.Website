import { IBuild } from '../../models/build/IBuild'
import { IMigration } from '../../models/utils/IMigration'
import Result from '../Result'

/**
 * Represents a migration that replaces the compass inventory slot by the special inventory slots in obsolete builds.
 */
export class MigrationCompassToSpecial implements IMigration {
  public migrateBuild = this.executeBuildMigration
  public migrateBuildUnrelatedData = (): Promise<Result<void>> => Promise.resolve(Result.ok())
  public version = undefined

  private async executeBuildMigration(build: IBuild): Promise<Result> {
    const obsoleteInventorySlot = build.inventorySlots.find(is => is.typeId === 'compass')

    if (obsoleteInventorySlot != null) {
      obsoleteInventorySlot.typeId = 'special'
      obsoleteInventorySlot.items = [
        obsoleteInventorySlot.items[0],
        undefined,
        undefined
      ]
    }

    return Result.ok()
  }
}