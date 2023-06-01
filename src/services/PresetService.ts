import { IArmorMod } from '../models/item/IArmorMod'
import { IItem } from '../models/item/IItem'
import { IMod } from '../models/item/IMod'
import { IModdable } from '../models/item/IModdable'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import Result from '../utils/Result'
import { InventoryItemService } from './InventoryItemService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'
import i18n from '../plugins/vueI18n'
import { IHeadwear } from '../models/item/IHeadwear'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { ItemFetcherService } from './ItemFetcherService'
import { PathUtils } from '../utils/PathUtils'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'

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
  public async fetchPresets(): Promise<void> {
    const presetsResult = await Services.get(ItemFetcherService).fetchPresets()

    if (!presetsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, presetsResult.failureMessage, true)

      return
    }

    this.presets = presetsResult.value
  }

  /**
   * Gets the preset of an item.
   * @param id - ID of the item for which the preset must be found.
   * @returns Preset.
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
  public async getPresetModSlotContainingItem(itemId: string, path: string): Promise<IInventoryModSlot | undefined> {
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
      return presetModSlot
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
    const itemPropertiesService = Services.get(ItemPropertiesService)

    if (itemPropertiesService.isModdable(item)) {
      return (item as IModdable).baseItemId != null
    }

    return false
  }

  /**
   * Updates the properties of a preset in a list of items.
   */
  public async updatePresetProperties(items: IItem[]): Promise<void> {
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const presetItems = items.filter(i => this.isPreset(i))

    for (const presetItem of presetItems) {
      let result: Result

      const presetInventoryItem = this.getPreset(presetItem.id)

      if (presetInventoryItem == null) {
        Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.presetNotFound', { id: presetItem.id }), true)

        continue
      }

      if (itemPropertiesService.isArmorMod(presetItem)) {
        result = await this.updatePresetWithArmorProperties(presetItem as IArmorMod, presetInventoryItem)
      } else if (itemPropertiesService.isHeadwear(presetItem)) {
        result = await this.updatePresetWithArmorProperties(presetItem as IHeadwear, presetInventoryItem)
      } else if (itemPropertiesService.isRangedWeapon(presetItem)) {
        result = await this.updateRangedWeapondPresetProperties(presetItem as IRangedWeapon, presetInventoryItem)
      } else if (itemPropertiesService.isRangedWeaponMod(presetItem)) {
        result = await this.updateRangedWeapondModPresetProperties(presetItem as IRangedWeaponMod, presetInventoryItem)
      } else {
        result = await this.updateModPresetProperties(presetItem as IMod, presetInventoryItem)
      }

      if (!result.success) {
        Services.get(NotificationService).notify(NotificationType.error, result.failureMessage, true)
      }
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
      /* istanbul ignore else */
      if (presetModSlot.item != null) {
        pathModSlotNames.splice(0, 1)

        return this.getPresetModSlot(presetModSlot.item, pathModSlotNames)
      } else {
        // We should never have a preset that has an empty mod slot
        return undefined
      }
    }

    return presetModSlot
  }

  /**
   * Updates the properties of a preset that has armor.
   * @param presetItem - Preset item.
   * @param presetInventoryItem - Preset inventory item.
   */
  private async updatePresetWithArmorProperties(presetItem: IArmorMod | IHeadwear, presetInventoryItem: IInventoryItem): Promise<Result> {
    const ergonomicsPercentageModifierResult = await Services.get(InventoryItemService).getErgonomicsPercentageModifier(presetInventoryItem)

    if (!ergonomicsPercentageModifierResult.success) {
      return Result.failFrom(ergonomicsPercentageModifierResult)
    }

    presetItem.presetErgonomicsPercentageModifier = ergonomicsPercentageModifierResult.value.ergonomicsPercentageModifierWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a mod preset.
   * @param presetItem - Preset item.
   * @param presetInventoryItem - Preset inventory item.
   */
  private async updateModPresetProperties(presetItem: IMod, presetInventoryItem: IInventoryItem): Promise<Result> {
    const ergonomicsResult = await Services.get(InventoryItemService).getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    presetItem.presetErgonomicsModifier = ergonomicsResult.value.ergonomicsWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a ranged weapon preset.
   * @param presetItem - Preset item.
   * @param presetInventoryItem - Preset inventory item.
   */
  private async updateRangedWeapondPresetProperties(presetItem: IRangedWeapon, presetInventoryItem: IInventoryItem): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const ergonomicsResult = await inventoryItemService.getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    const recoilResult = await inventoryItemService.getRecoil(presetInventoryItem)

    if (!recoilResult.success) {
      return Result.failFrom(recoilResult)
    }

    presetItem.presetErgonomics = ergonomicsResult.value.ergonomicsWithMods
    presetItem.presetHorizontalRecoil = recoilResult.value.horizontalRecoilWithMods
    presetItem.presetVerticalRecoil = recoilResult.value.verticalRecoilWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a ranged weapon mod preset.
   * @param presetItem - Preset item.
   * @param presetInventoryItem - Preset inventory item.
   */
  private async updateRangedWeapondModPresetProperties(presetItem: IRangedWeaponMod, presetInventoryItem: IInventoryItem): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const ergonomicsResult = await inventoryItemService.getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    const recoildPercentageModifierResult = await inventoryItemService.getRecoilPercentageModifier(presetInventoryItem)

    if (!recoildPercentageModifierResult.success) {
      return Result.failFrom(recoildPercentageModifierResult)
    }

    presetItem.presetErgonomicsModifier = ergonomicsResult.value.ergonomicsWithMods
    presetItem.presetRecoilPercentageModifier = recoildPercentageModifierResult.value.recoilPercentageModifierWithMods

    return Result.ok()
  }
}