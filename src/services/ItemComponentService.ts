import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IItem } from '../models/item/IItem'
import { IMagazine } from '../models/item/IMagazine'
import { IModdable } from '../models/item/IModdable'
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
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const isNewItemModdable = itemPropertiesService.isModdable(newItem)

    if (!isNewItemModdable) {
      return []
    }

    const presetService = Services.get(PresetService)
    const preset = presetService.getPreset(newItem.id)

    if (preset != null) {
      // Creating a copy of the preset mod slots, otherwise the preset is modified for the whole application
      const presetModSlots = JSON.parse(JSON.stringify(preset.modSlots)) as IInventoryModSlot[]

      return presetModSlots
    }

    const newModSlots: IInventoryModSlot[] = []
    const oldModSlotsWithItem = oldItem?.modSlots.filter(ms => ms.item != null) ?? []

    for (const newItemModSlot of (newItem as IModdable).modSlots) {
      let oldModSlotItem: IInventoryItem | undefined = undefined
      const similarOldModSlotIndex = oldModSlotsWithItem.findIndex(omswi => omswi.modSlotName === newItemModSlot.name)

      if (similarOldModSlotIndex >= 0) {
        const similarOldModSlot = oldModSlotsWithItem[similarOldModSlotIndex]
        oldModSlotsWithItem.splice(similarOldModSlotIndex, 1) // Removing the old mod slot with item to not take it into acount a second time

        if (newItemModSlot.compatibleItemIds.includes(similarOldModSlot.item!.itemId)) {
          oldModSlotItem = similarOldModSlot.item
        }
      }

      newModSlots.push({
        modSlotName: newItemModSlot.name,
        item: oldModSlotItem
      })
    }

    return newModSlots
  }
}