import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IItem } from '../models/item/IItem'
import { IMagazine } from '../models/item/IMagazine'
import { ItemPropertiesService } from './ItemPropertiesService'
import { PresetService } from './PresetService'
import Services from './repository/Services'

/**
 * Represents a service for the ItemComponent.
 */
export class ItemComponentService {
  /**
   * Gets the content for an item replacing another item.
   * Replacing a container with another container keeps items unless items are magazines that contain incompatible ammunition.
   * @param oldItem - Item being replaced.
   * @param newItem - Item replacing the old item.
   */
  public getReplacingItemContent(oldItem: IInventoryItem | undefined, newItem: IItem): IInventoryItem[] {
    const _itemPropertiesService = Services.get(ItemPropertiesService)
    const newItemIsContainer = _itemPropertiesService.canContain(newItem)

    if (!newItemIsContainer
      || oldItem == null
      || oldItem.content.length === 0) {
      return []
    }

    const newContent: IInventoryItem[] = []
    const newItemIsMagazine = _itemPropertiesService.isMagazine(newItem)

    if (!newItemIsMagazine) {
      newContent.push(...oldItem.content)
    } else {
      const magazine = (newItem as IMagazine)

      for (const ammunitionInventoryItem of oldItem.content) {
        const isCompatible = magazine.acceptedAmmunitionIds.some(aci => aci === ammunitionInventoryItem.itemId)

        if (isCompatible) {
          ammunitionInventoryItem.quantity = magazine.capacity
          newContent.push(ammunitionInventoryItem)
        }
      }
    }

    return newContent
  }

  /**
   * Gets the mods for an item replacing another item.
   * Replacing an item with a preset replaces all mods with the mods of the preset.
   * Replacing an item with similar mods slots that accept similar mods keeps those mods.
   * @param oldItem - Item being replaced.
   * @param newItem - Item replacing the old item.
   */
  public getReplacingModSlots(oldItem: IInventoryItem | undefined, newItem: IItem): IInventoryModSlot[] {
    const presetService = Services.get(PresetService)
    const preset = presetService.getPreset(newItem.id)

    const newModSlots: IInventoryModSlot[] = []

    if (preset != null) {
      newModSlots.push(...preset.modSlots)
    }

    return newModSlots
  }
}