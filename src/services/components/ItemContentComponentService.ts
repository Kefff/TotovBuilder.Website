import { IItem } from '../../models/item/IItem'
import { ItemService } from '../ItemService'
import Services from '../repository/Services'
import { NotificationService, NotificationType } from '../NotificationService'
import { IMagazine } from '../../models/item/IMagazine'

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
    const itemService = Services.get(ItemService)
    const itemCategories = await itemService.getItemCategories()
    const itemsResult = await itemService.getItemsOfCategories(itemCategories, true)

    if (!itemsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemsResult.failureMessage)
      return []
    }

    return itemsResult.value
  }

  /**
   * Gets the accepted items for a magazine.
   * @param magazine - Magazine.
   * @returns Accepted items.
   */
  private async getMagazineAcceptedItems(magazine: IItem): Promise<IItem[]> {
    const itemService = Services.get(ItemService)
    const itemsResult = await itemService.getItems((magazine as IMagazine).acceptedAmmunitionIds, true)

    if (!itemsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemsResult.failureMessage)
      return []
    }

    return itemsResult.value
  }
}