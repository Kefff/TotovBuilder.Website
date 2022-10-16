import { IMagazine } from '../../../models/item/IMagazine'
import { ItemService } from '../../ItemService'
import { NotificationService, NotificationType } from '../../NotificationService'
import Services from '../../repository/Services'

/**
 * Represents a service responsible for managing a MagazineStats component.
 */
export class MagazineStatsComponentService {
  /**
   * Gets a the names of the accepted cartridges of a IMagazine.
   * @param magazine - Magazine.
   */
  public async getAcceptedCartridgesNames(magazine: IMagazine): Promise<string[]> {
    const acceptedAmmunitionNames: string[] = []
    const itemService = Services.get(ItemService)

    for (const acceptedAmmunitionId of magazine.acceptedAmmunitionIds) {
      const itemResult = await itemService.getItem(acceptedAmmunitionId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        continue
      }

      acceptedAmmunitionNames.push(itemResult.value.name)
    }

    return acceptedAmmunitionNames
  }
}