import { IItem } from '../../models/item/IItem'
import { ItemService } from '../ItemService'
import Services from '../repository/Services'
import StringUtils from '../../utils/StringUtils'
import { NotificationService, NotificationType } from '../NotificationService'
import { IMagazine } from '../../models/item/IMagazine'
import { MerchantFilterService } from '../MerchantFilterService'

/**
 * Represents a service responsible for managing an ItemContentComponent.
 */
export class ItemContentComponentService {
  /**
   * Gets the items accepted as the content of another item.
   * Sorted by default by item category and caption.
   * @param itemId - Item ID.
   * @returns Accepted items.
   */
  public async getAcceptedItems(itemId: string): Promise<IItem[]> {
    let acceptedItems: IItem[] = []
    const itemResult = await Services.get(ItemService).getItem(itemId)

    if (!itemResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

      return []
    }

    switch (itemResult.value.categoryId) {
      case 'magazine': {
        acceptedItems = await this.getMagazineAcceptedItems(itemResult.value)
        break
      }
      default: {
        acceptedItems = await this.getItemAcceptedItems()
      }
    }

    return acceptedItems
  }

  /**
   * Gets the accepted items category IDs used to detemine the available sort buttons in the item selection dropdown.
   * @param itemCategoryId - Parent item category ID.
   * @returns Accepted items category IDs.
   */
  public getCategoryIds(itemCategoryId: string): string[] {
    switch (itemCategoryId) {
      case 'magazine': {
        return ['ammunition']
      }
      default: {
        return ['item']
      }
    }
  }

  /**
   * Gets the accepted items for an item.
   * @returns Accepted items.
   */
  private async getItemAcceptedItems(): Promise<IItem[]> {
    const acceptedItems: IItem[] = []
    const merchantFilterService = Services.get(MerchantFilterService)
    const itemService = Services.get(ItemService)
    const itemCategories = await itemService.getItemCategories()

    for (const category of itemCategories) {
      const itemsResult = await itemService.getItemsOfCategory(category.id)

      if (!itemsResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemsResult.failureMessage)

        continue
      }

      const acceptedItemsResult = itemsResult.value.filter(i => merchantFilterService.hasMatchingPrices(i, true))
      acceptedItemsResult.sort((item1: IItem, item2: IItem) => StringUtils.compare(item1.name, item2.name))

      acceptedItems.push(...acceptedItemsResult)
    }

    return acceptedItems
  }

  /**
   * Gets the accepted items for a magazine.
   * @param magazine - Magazine.
   * @returns Accepted items.
   */
  private async getMagazineAcceptedItems(magazine: IItem): Promise<IItem[]> {
    const merchantFilterService = Services.get(MerchantFilterService)
    const acceptedItems: IItem[] = []
    const itemService = Services.get(ItemService)

    for (const acceptedAmmunitionId of (magazine as IMagazine).acceptedAmmunitionIds) {
      const itemResult = await itemService.getItem(acceptedAmmunitionId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        continue
      }

      if (merchantFilterService.hasMatchingPrices(itemResult.value, true)) {
        acceptedItems.push(itemResult.value)
      }
    }

    return acceptedItems
  }
}