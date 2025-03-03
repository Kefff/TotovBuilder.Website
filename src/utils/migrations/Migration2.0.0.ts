import { IMigration } from '../../models/utils/IMigration'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'

/**
 * Represents a migration that updates the global filter to make sure it correctly initialized.
 */
export class Migration200 implements IMigration {
  public migrateBuildPromise = (): Promise<boolean> => Promise.resolve(true)
  public migrateBuildUnrelatedDataPromise = this.executeMigrateBuildUnrelatedDataPromise
  public version = '2.0.0'

  private executeMigrateBuildUnrelatedDataPromise(): Promise<boolean> {
    const globalFilterService = Services.get(GlobalFilterService)
    const itemService = Services.get(ItemService)

    const globalFilter = globalFilterService.get()
    globalFilter.excludeItemsWithoutMatchingPrice = true
    globalFilter.excludePresetBaseItems = true

    itemService.emitter.once(ItemService.initializationFinishedEvent, () => {
      // Need to wait for items to be loaded because saving the global filter
      // updates the list of available items which requires them to be loaded
      globalFilterService.save(globalFilter)
    })

    return Promise.resolve(true)
  }
}