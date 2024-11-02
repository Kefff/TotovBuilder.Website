import { IInventoryItem } from '../../models/build/IInventoryItem'
import { CompatibilityRequestType } from '../compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../compatibility/CompatibilityService'
import Services from '../repository/Services'

/**
 * Represents a service responsible for managing an InventorySlotComponent.
 */
export class InventorySlotComponentService {
  /**
   * Checks whether an item is compatible with the build it is being added in.
   * @param inventorySlotTypeId - ID of the inventory slot in which the item is being added.
   * @param item - Item.
   * @param path - Path.
   * @returns True if the item is compatible with the build; otherwise False.
   */
  public async checkCompatibilityAsync(inventorySlotTypeId: string, item: IInventoryItem | undefined, path: string): Promise<boolean> {
    if (item == null) {
      return true
    }

    let compatibilityResult: boolean = true

    if (inventorySlotTypeId === 'bodyArmor') {
      compatibilityResult = await Services.get(CompatibilityService).checkCompatibility(CompatibilityRequestType.armor, item.itemId, path)
    } else if (inventorySlotTypeId === 'tacticalRig') {
      compatibilityResult = await Services.get(CompatibilityService).checkCompatibility(CompatibilityRequestType.tacticalRig, item.itemId, path)
    }

    return compatibilityResult
  }
}