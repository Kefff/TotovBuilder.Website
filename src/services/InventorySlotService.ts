import InventorySlotTypes from '../data/inventory-slot-types.json'
import { IInventorySlotType } from '../models/build/IInventorySlotType'
import vueI18n from '../plugins/vueI18n'

/**
 * Represents a services responsible for managing inventory slots.
 */
export class InventorySlotService {
  /**
   * Gets an inventory slot type.
   * @param id - ID of the slot type.
   * @returns Inventory slot type.
   * @throws When the inventory stop type is not found.
   */
  public getType(id: string): IInventorySlotType {
    const jsonSlotType = InventorySlotTypes.find((ist) => ist.id === id)

    if (jsonSlotType == null) {
      throw new Error(vueI18n.t('message.inventorySlotTypeNotFound', { id }))
    }

    const slotType: IInventorySlotType = {
      acceptedItemCategories: [...jsonSlotType.acceptedItemCategoryIds],
      canBeLooted: jsonSlotType.canBeLooted,
      customIcon: jsonSlotType.customIcon,
      displayOrder: jsonSlotType.displayOrder,
      id: jsonSlotType.id,
      icon: jsonSlotType.icon,
      itemSlotsAmount: jsonSlotType.itemSlotsAmount
    }

    return slotType
  }
}