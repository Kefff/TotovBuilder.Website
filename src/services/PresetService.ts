import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IArmor } from '../models/item/IArmor'
import { IItem } from '../models/item/IItem'
import { IMod } from '../models/item/IMod'
import { IModdable } from '../models/item/IModdable'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import { PathUtils } from '../utils/PathUtils'
import { InventoryItemService } from './InventoryItemService'
import { ItemFetcherService } from './ItemFetcherService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { LogService } from './LogService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing presets.
 */
export class PresetService {
  /**
   * Fetched presets.
   */
  private presets: IInventoryItem[] = []

  /**
   * Fetches presets.
   */
  public async fetchPresets(): Promise<boolean> {
    const presets = await Services.get(ItemFetcherService).fetchPresets()

    if (presets == undefined) {
      return false
    }

    this.presets = presets

    return true
  }

  /**
   * Gets the preset of an item.
   * @param id - ID of the item for which the preset must be found.
   * @returns Preset or undefined when no preset exist for the item.
   */
  public getPreset(id: string): IInventoryItem | undefined {
    const preset = this.presets.find(p => p.itemId === id)

    return preset
  }

  /**
   * Gets the preset mod slot the inventory item is a part of.
   * @param itemId - Item ID.
   * @param path - Mod slot path indicating the inventory object position within a parent item.
   * @returns Preset mod slot if the inventory item is in a preset; otherwise undefined.
   */
  public getPresetModSlotContainingItem(itemId: string, path: string): IInventoryModSlot | undefined {
    const pathArray = path.split('/')
    const firstModIndex = pathArray.findIndex(p => p.startsWith(PathUtils.modSlotPrefix))

    if (firstModIndex < 0) {
      return undefined
    }

    const presetId = pathArray[firstModIndex - 1].replace(PathUtils.itemPrefix, '')
    const preset = this.getPreset(presetId)

    if (preset == null) {
      return undefined
    }

    const pathModSlotNames = pathArray.filter(p => p.startsWith(PathUtils.modSlotPrefix)).map(p => p.replace(PathUtils.modSlotPrefix, ''))
    const presetModSlot = this.getPresetModSlot(preset, pathModSlotNames)

    if (presetModSlot == null) {
      return undefined
    }

    const isModSlot = PathUtils.checkIsModSlotPath(path)

    if (isModSlot) {
      if (presetModSlot.item?.itemId === itemId) {
        return presetModSlot
      }

      return undefined
    }

    let pathContentElement = ''

    for (let i = pathArray.length - 1; i >= 0; i--) {
      if (pathArray[i].startsWith(PathUtils.contentPrefix)) {
        pathContentElement = pathArray[i]
        break
      }
    }

    pathContentElement = pathContentElement.replace(PathUtils.contentPrefix, '')
    const contentIndexString = pathContentElement.slice(0, pathContentElement.indexOf('_'))
    const contentIndex = Number(contentIndexString)

    if (presetModSlot.item?.content[contentIndex]?.itemId === itemId) {
      return presetModSlot
    }

    return undefined
  }

  /**
   * Indicates whether an item is a preset or not.
   * @param item - Item.
   * @returns true if the item is a preset; otherwise false.
   */
  public isPreset(item: IItem): boolean {
    if (Services.get(ItemPropertiesService).isModdable(item)) {
      return (item as IModdable).baseItemId != null
    }

    return false
  }

  /**
   * Updates the properties of a preset in a list of items.
   */
  public async updatePresetProperties(items: IItem[]): Promise<void> {
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const inventoryItemService = Services.get(InventoryItemService)

    const notFoundPresetIds: string[] = []
    const presetItems = items.filter(i => this.isPreset(i))

    for (const presetItem of presetItems) {
      const presetInventoryItem = this.getPreset(presetItem.id)

      if (presetInventoryItem == null) {
        notFoundPresetIds.push(presetItem.id)

        continue
      }

      if (itemPropertiesService.canHaveArmor(presetItem)) {
        const armorModifiers = await inventoryItemService.getArmorModifiers(presetInventoryItem)
        const wearableModifiers = await inventoryItemService.getWearableModifiers(presetInventoryItem)

        const armorPreset = presetItem as IArmor
        armorPreset.presetArmorModifiers = armorModifiers
        armorPreset.presetWearableModifiers = wearableModifiers
      } else if (itemPropertiesService.isRangedWeapon(presetItem)) {
        const ergonomics = await inventoryItemService.getErgonomics(presetInventoryItem)
        const recoil = await inventoryItemService.getRecoil(presetInventoryItem)

        const rangedWeaponPreset = presetItem as IRangedWeapon
        rangedWeaponPreset.presetRangedWeaponModifiers = {
          ergonomics: ergonomics.ergonomicsWithMods,
          horizontalRecoil: recoil.horizontalRecoilWithMods,
          verticalRecoil: recoil.verticalRecoilWithMods
        }
      } else if (itemPropertiesService.isRangedWeaponMod(presetItem)) {
        const ergonomics = await inventoryItemService.getErgonomics(presetInventoryItem)
        const recoildModifierPercentage = await inventoryItemService.getRecoilModifierPercentage(presetInventoryItem)

        const rangedWeaponModPreset = presetItem as IRangedWeaponMod
        rangedWeaponModPreset.presetErgonomicsModifier = ergonomics.ergonomicsWithMods
        rangedWeaponModPreset.presetRecoilModifierPercentage = recoildModifierPercentage.recoilModifierPercentageWithMods
      } else {
        const ergonomics = await inventoryItemService.getErgonomics(presetInventoryItem)

        const modPreset = presetItem as IMod
        modPreset.presetErgonomicsModifier = ergonomics.ergonomicsWithMods
      }
    }

    if (notFoundPresetIds.length > 0) {
      Services.get(LogService).logError('message.presetsNotFound', { ids: notFoundPresetIds.join(', ') })
    }
  }

  /**
   * Gets the mod slot in a preset corresponding to a mod slot path.
   * @param presetInventoryItem - Preset.
   * @param pathModSlotNames - Names of the mod slots present in a path leading to a mod.
   * @returns Mod slot path corresponding to the mod slot path.
   */
  private getPresetModSlot(presetInventoryItem: IInventoryItem, pathModSlotNames: string[]): IInventoryModSlot | undefined {
    const presetModSlot = presetInventoryItem.modSlots.find(ms => ms.modSlotName === pathModSlotNames[0])

    if (presetModSlot == null) {
      return undefined
    }

    if (pathModSlotNames.length > 1) {
      if (presetModSlot.item != null) {
        pathModSlotNames.splice(0, 1)

        return this.getPresetModSlot(presetModSlot.item, pathModSlotNames)
      } /* c8 ignore start */ else {
        // We should never have a preset that has an empty mod slot
        return undefined
      } /* c8 ignore stop */
    }

    return presetModSlot
  }
}