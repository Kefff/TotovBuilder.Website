import { IArmorMod } from '../models/item/IArmorMod'
import { IItem } from '../models/item/IItem'
import { IMod } from '../models/item/IMod'
import { IModdable } from '../models/item/IModdable'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import Result, { FailureType } from '../utils/Result'
import { InventoryItemService } from './InventoryItemService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { ItemService } from './ItemService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'
import i18n from '../plugins/vueI18n'
import { IHeadwear } from '../models/item/IHeadwear'

/**
 * Represents a service responsible for managing properties of a preset.
 */
export class PresetPropertiesService {
  /**
   * Updates the properties of a preset in a list of items.
   * @param items - Items.
   */
  public async updatePresetProperties(items: IItem[]): Promise<void> {
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const presetItems = items.filter(i => this.isPreset(i))

    for (const presetItem of presetItems) {
      let result: Result

      if (itemPropertiesService.isArmorMod(presetItem)) {
        result = await this.updatePresetWithArmorProperties(presetItem as IArmorMod)
      } else if (itemPropertiesService.isHeadwear(presetItem)) {
        result = await this.updatePresetWithArmorProperties(presetItem as IHeadwear)
      } else if (itemPropertiesService.isRangedWeapon(presetItem)) {
        result = await this.updateRangedWeapondPresetProperties(presetItem as IRangedWeapon)
      } else if (itemPropertiesService.isRangedWeaponMod(presetItem)) {
        result = await this.updateRangedWeapondModPresetProperties(presetItem as IRangedWeaponMod)
      } else {
        result = await this.updateModPresetProperties(presetItem as IMod)
      }

      if (!result.success) {
        Services.get(NotificationService).notify(NotificationType.error, result.failureMessage, true)

        continue
      }
    }
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
   * Updates the properties of a preset that has armor.
   * @param preset - Preset.
   */
  private async updatePresetWithArmorProperties(preset: IArmorMod | IHeadwear): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const presetInventoryItem = await Services.get(ItemService).getPreset(preset.id)

    if (presetInventoryItem == null) {
      return Result.fail(FailureType.error, 'PresetPropertiesService.updatePresetWithArmorProperties()', i18n.t('message.presetNotFound', { id: preset.id }))
    }

    const ergonomicsPercentageModifierResult = await inventoryItemService.getErgonomicsPercentageModifier(presetInventoryItem)

    if (!ergonomicsPercentageModifierResult.success) {
      return Result.failFrom(ergonomicsPercentageModifierResult)
    }

    preset.presetErgonomicsPercentageModifier = ergonomicsPercentageModifierResult.value.ergonomicsPercentageModifierWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a mod preset.
   * @param preset - Preset.
   */
  private async updateModPresetProperties(preset: IMod): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const presetInventoryItem = await Services.get(ItemService).getPreset(preset.id)

    if (presetInventoryItem == null) {
      return Result.fail(FailureType.error, 'PresetPropertiesService.updateModPresetProperties()', i18n.t('message.presetNotFound', { id: preset.id }))
    }

    const ergonomicsResult = await inventoryItemService.getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    preset.presetErgonomicsModifier = ergonomicsResult.value.ergonomicsWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a ranged weapon preset.
   * @param preset - Preset.
   */
  private async updateRangedWeapondPresetProperties(preset: IRangedWeapon): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const presetInventoryItem = await Services.get(ItemService).getPreset(preset.id)

    if (presetInventoryItem == null) {
      return Result.fail(FailureType.error, 'PresetPropertiesService.updateModPresetProperties()', i18n.t('message.presetNotFound', { id: preset.id }))
    }

    const ergonomicsResult = await inventoryItemService.getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    const recoilResult = await inventoryItemService.getRecoil(presetInventoryItem)

    if (!recoilResult.success) {
      return Result.failFrom(recoilResult)
    }

    preset.presetErgonomics = ergonomicsResult.value.ergonomicsWithMods
    preset.presetHorizontalRecoil = recoilResult.value.horizontalRecoilWithMods
    preset.presetVerticalRecoil = recoilResult.value.verticalRecoilWithMods

    return Result.ok()
  }

  /**
   * Updates the properties of a ranged weapon mod preset.
   * @param preset - Preset.
   */
  private async updateRangedWeapondModPresetProperties(preset: IRangedWeaponMod): Promise<Result> {
    const inventoryItemService = Services.get(InventoryItemService)
    const presetInventoryItem = await Services.get(ItemService).getPreset(preset.id)

    if (presetInventoryItem == null) {
      return Result.fail(FailureType.error, 'PresetPropertiesService.updateModPresetProperties()', i18n.t('message.presetNotFound', { id: preset.id }))
    }

    const ergonomicsResult = await inventoryItemService.getErgonomics(presetInventoryItem)

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    const recoildPercentageModifierResult = await inventoryItemService.getRecoilPercentageModifier(presetInventoryItem)

    if (!recoildPercentageModifierResult.success) {
      return Result.failFrom(recoildPercentageModifierResult)
    }

    preset.presetErgonomicsModifier = ergonomicsResult.value.ergonomicsWithMods
    preset.presetRecoilPercentageModifier = recoildPercentageModifierResult.value.recoilPercentageModifierWithMods

    return Result.ok()
  }
}