import { IInventorySlotType } from '../models/build/IInventorySlotType'
import i18n from '../plugins/vueI18n'
import InventorySlotTypes from '../assets/data/inventory-slot-types.json'
import Result, { FailureType } from '../utils/Result'

/**
 * Represents a services responsible for managing inventory slots.
 */
export class InventorySlotService {
  /**
   * Gets an inventory slot type.
   * @param id - ID of the slot type.
   * @returns Inventory slot type.
   */
  public async getType(id: string): Promise<Result<IInventorySlotType>> {
    const jsonSlotType = InventorySlotTypes.find((ist) => ist.id === id)

    if (jsonSlotType == null) {
      return Result.fail(FailureType.error, 'InventorySlotTypeService.get()', i18n.t('message.inventorySlotTypeNotFound', { id: id }))
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

    return Result.ok(slotType)
  }
}