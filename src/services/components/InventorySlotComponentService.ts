import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import Result from '../../utils/Result'
import StringUtils from '../../utils/StringUtils'
import { CompatibilityRequestType } from '../compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../compatibility/CompatibilityService'
import { ItemService } from '../ItemService'
import { MerchantFilterService } from '../MerchantFilterService'
import { NotificationService, NotificationType } from '../NotificationService'
import Services from '../repository/Services'

/**
 * Represents a service responsible for managing an InventorySlotComponent.
 */
export class InventorySlotComponentService {
  /**
   * Gets the items accepted in an inventory slot.
   * Sorted by default by item category and caption.
   * @param categoryIds - IDs of the categories from which the items are accepted.
   * @returns Accepted items.
   */
  public async getAcceptedItems(categoryIds: string[]): Promise<IItem[]> {
    const merchantFilterService = Services.get(MerchantFilterService)
    const itemService = Services.get(ItemService)

    const itemsResult = await itemService.getItemsOfCategories(categoryIds)

    if (!itemsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemsResult.failureMessage)
      return []
    }

    const acceptedItems = itemsResult.value.filter(i => merchantFilterService.hasMatchingPrices(i, true))
    acceptedItems.sort((item1: IItem, item2: IItem) => StringUtils.compare(item1.name, item2.name))

    return acceptedItems
  }

  /**
   * Checks whether an item is compatible with the build it is being added in.
   * @param inventorySlotTypeId - ID of the inventory slot in which the item is being added.
   * @param item - Item.
   * @param path - Path.
   * @returns True if the item is compatible with the build; otherwise False.
   */
  public async checkCompatibility(inventorySlotTypeId: string, item: IInventoryItem | undefined, path: string): Promise<boolean> {
    if (item == null) {
      return true
    }

    let compatibilityResult: Result | undefined

    if (inventorySlotTypeId === 'bodyArmor') {
      compatibilityResult = await Services.get(CompatibilityService).checkCompatibility(CompatibilityRequestType.armor, item.itemId, path)
    } else if (inventorySlotTypeId === 'tacticalRig') {
      compatibilityResult = await Services.get(CompatibilityService).checkCompatibility(CompatibilityRequestType.tacticalRig, item.itemId, path)
    }

    if (compatibilityResult != null && !compatibilityResult.success) {
      Services.get(NotificationService).notify(NotificationType.warning, compatibilityResult.failureMessage, true)

      return false
    }

    return true
  }
}