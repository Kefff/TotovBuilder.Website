import { IArmorMod } from '../models/item/IArmorMod'
import { IItem } from '../models/item/IItem'
import { IMod } from '../models/item/IMod'
import { IModdable } from '../models/item/IModdable'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import Result from '../utils/Result'
import { InventoryItemService } from './InventoryItemService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { ItemService } from './ItemService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'
import i18n from '../plugins/vueI18n'
import { IHeadwear } from '../models/item/IHeadwear'
import { IInventoryItem } from '../models/build/IInventoryItem'

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

      const presetInventoryItem = await Services.get(ItemService).getPreset(presetItem.id)

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