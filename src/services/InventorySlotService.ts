import InventorySlotTypes from '../data/inventory-slot-types.json'
import { IInventorySlotType } from '../models/build/IInventorySlotType'
import vueI18n from '../plugins/vueI18n'
import { LogService } from './LogService'
import Services from './repository/Services'

/**
 * Represents a services responsible for managing inventory slots.
 */
export class InventorySlotService {
  /**
   * Gets an inventory slot type.
   * @param id - ID of the slot type.
   * @returns Inventory slot type.
   */
  public getType(id: string): IInventorySlotType | undefined {
    const jsonSlotType = InventorySlotTypes.find((ist) => ist.id === id)

    if (jsonSlotType == null) {
      Services.get(LogService).logError(vueI18n.t('message.inventorySlotTypeNotFound', { id: id }))

      return undefined
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