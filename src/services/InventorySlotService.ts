import { IInventorySlotType } from '../models/build/IInventorySlotType'
import { IItemCategory } from '../models/item/IItemCategory'
import { IItemType } from '../models/item/IItemType'
import i18n from '../plugins/vueI18n'
import InventorySlotTypes from '../assets/data/inventory-slot-types.json'
import Result, { FailureType } from '../utils/Result'
import { ItemService } from './ItemService'
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
  public async getType(id: string): Promise<Result<IInventorySlotType>> {
    const jsonSlotType = InventorySlotTypes.find((ist) => ist.id === id)

    if (jsonSlotType === undefined) {
      return Result.fail(FailureType.error, 'InventorySlotTypeService.get()', i18n.t('message.inventorySlotTypeNotFound', { id: id }))
    }

    const slotType: IInventorySlotType = {
      acceptedItemCategories: [],
      canBeLooted: jsonSlotType.canBeLooted,
      customIcon: jsonSlotType.customIcon,
      displayOrder: jsonSlotType.displayOrder,
      id: jsonSlotType.id,
      icon: jsonSlotType.icon,
      itemSlotsAmount: jsonSlotType.itemSlotsAmount
    }

    const itemCategories = await Services.get(ItemService).getItemCategories()

    for (const categoryId of jsonSlotType.acceptedItemCategoryIds) {
      const jsonItemCategory = itemCategories.find((ic) => ic.id === categoryId)

      if (jsonItemCategory === undefined) {
        return Result.fail(FailureType.error, 'InventorySlotTypeService.get()', i18n.t('message.itemCategoryNotFound', { id: categoryId }))
      }

      const itemCategory: IItemCategory = {
        id: jsonItemCategory.id,
        types: jsonItemCategory.types as IItemType[]
      }

      slotType.acceptedItemCategories.push(itemCategory)
    }

    return Result.ok(slotType)
  }
}