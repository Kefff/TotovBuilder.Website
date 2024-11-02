import { IItem, ItemCategoryId } from '../../models/item/IItem'
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
  public async getAcceptedItemsAsync(itemId: string): Promise<IItem[]> {
    let acceptedItems: IItem[] = []
    const item = await Services.get(ItemService).getItemAsync(itemId)

    switch (item.categoryId) {
      case ItemCategoryId.magazine: {
        acceptedItems = await this.getMagazineAcceptedItemsAsync(item)
        break
      }
      default: {
        acceptedItems = await this.getItemAcceptedItemsAsync()
      }
    }

    return acceptedItems
  }

  /**
   * Gets the accepted items category IDs used to detemine the available sort buttons in the item selection dropdown.
   * @param itemCategoryId - Parent item category ID.
   * @returns Accepted items category ID or undefined when all items are accepted.
   */
  public getAcceptedItemsCategoryId(itemCategoryId: ItemCategoryId): ItemCategoryId | undefined {
    switch (itemCategoryId) {
      case ItemCategoryId.magazine: {
        return ItemCategoryId.ammunition
      }
      default: {
        return undefined
      }
    }
  }

  /**
   * Gets the accepted items for an item.
   * This corresponds to all item categories.
   * @returns Accepted items.
   */
  private async getItemAcceptedItemsAsync(): Promise<IItem[]> {
    const itemService = Services.get(ItemService)
    const items = await itemService.getItemsOfCategoriesAsync(Object.values(ItemCategoryId) as ItemCategoryId[], true)

    return items
  }

  /**
   * Gets the accepted items for a magazine.
   * @param magazine - Magazine.
   * @returns Accepted items.
   */
  private async getMagazineAcceptedItemsAsync(magazine: IItem): Promise<IItem[]> {
    const items = await Services.get(ItemService).getItemsAsync((magazine as IMagazine).acceptedAmmunitionIds, true)

    return items
  }
}