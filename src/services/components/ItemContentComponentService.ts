import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemService } from '../ItemService'
import Services from '../repository/Services'

/**
 * Represents a service responsible for managing an ItemContentComponent.
 */
export class ItemContentComponentService {
  /**
   * Gets the items accepted as the content of another item.
   * @param itemId - Item ID.
   * @returns Accepted items.
   */
  public async getAcceptedItems(itemId: string): Promise<IItem[]> {
    let acceptedItems: IItem[] = []
    const item = await Services.get(ItemService).getItem(itemId)

    if (item == null) {
      return []
    }

    switch (item.categoryId) {
      case 'magazine': {
        acceptedItems = await this.getMagazineAcceptedItems(item)
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
   * @returns Accepted items category ID or undefined when all items are accepted.
   */
  public getAcceptedItemsCategoryId(itemCategoryId: string): string | undefined {
    switch (itemCategoryId) {
      case 'magazine': {
        return 'ammunition'
      }
      default: {
        return undefined
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
    const items = await itemService.getItemsOfCategories(itemCategories, true)

    return items
  }

  /**
   * Gets the accepted items for a magazine.
   * @param magazine - Magazine.
   * @returns Accepted items.
   */
  private async getMagazineAcceptedItems(magazine: IItem): Promise<IItem[]> {
    const items = await Services.get(ItemService).getItems((magazine as IMagazine).acceptedAmmunitionIds, true)

    return items
  }
}