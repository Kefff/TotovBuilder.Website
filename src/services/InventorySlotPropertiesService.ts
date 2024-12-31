/* eslint-disable no-irregular-whitespace */ // Special character used to force markdown to take into account spaces
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IInventorySlotType } from '../models/build/IInventorySlotType'
import InventorySlotTypes, { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { BuildsToTextType, IBuildsToTextOptions } from '../models/utils/IBuildsToTextOptions'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import vueI18n from '../plugins/vueI18n'
import { PriceUtils } from '../utils/PriceUtils'
import StringUtils from '../utils/StringUtils'
import { InventoryItemService } from './InventoryItemService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of an inventory slot.
 */
export class InventorySlotPropertiesService {
  /**
   * Gets an inventory slot summary.
   * @param inventorySlot - Inventory slot.
   * @returns Inventory slot summary.
   */
  public async getSummaryAsync(inventorySlot: IInventorySlot): Promise<IInventorySlotSummary> {
    const summary: IInventorySlotSummary = {
      armorModifiers: {
        armorClass: 0,
        durability: 0
      },
      ergonomics: 0,
      price: {
        missingPrice: false,
        priceByCurrency: [],
        priceInMainCurrency: 0
      },
      recoil: {
        horizontalRecoil: 0,
        verticalRecoil: 0
      },
      type: {
        acceptedItemCategories: [],
        canBeLooted: false,
        displayOrder: 0,
        id: InventorySlotTypeId.armband,
        itemSlotsAmount: 0
      },
      wearableModifiers: {
        ergonomicsModifierPercentage: 0,
        movementSpeedModifierPercentage: 0,
        turningSpeedModifierPercentage: 0
      },
      weight: 0
    }

    summary.type = Services.get(InventorySlotPropertiesService).getType(inventorySlot.typeId)
    summary.armorModifiers = await this.getArmorModifiersAsync(inventorySlot)
    summary.ergonomics = await this.getErgonomicsAsync(inventorySlot)
    summary.price = await this.getPriceAsync(inventorySlot, summary.type.canBeLooted)
    summary.recoil = await this.getRecoilAsync(inventorySlot)
    summary.wearableModifiers = await this.getWearableModifiersAsync(inventorySlot)
    summary.weight = await this.getWeightAsync(inventorySlot)

    return summary
  }

  /**
   * Gets an inventory slot type.
   * @param id - ID of the slot type.
   * @returns Inventory slot type.
   * @throws When the inventory stop type is not found.
   */
  public getType(id: InventorySlotTypeId): IInventorySlotType {
    const slotType = InventorySlotTypes.find((ist) => ist.id === id)

    if (slotType == null) {
      throw new Error(vueI18n.t('message.inventorySlotTypeNotFound', { id }))
    }

    return slotType
  }

  /**
   * Converts an inventory slot to a text.
   * @param inventorySlot - Inventory slot to convert.
   * @param options - Options.
   */
  public async toTextAsync(inventorySlot: IInventorySlot, options: IBuildsToTextOptions): Promise<string> {
    const italicToken = options.type === BuildsToTextType.markdown ? '*' : ''

    let inventorySlotAsString = ''
    const inventorySlotType = Services.get(InventorySlotPropertiesService).getType(inventorySlot.typeId)
    const inventoryItemService = Services.get(InventoryItemService)

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const itemAsString = await inventoryItemService.toTextAsync(inventoryItem, options, undefined, undefined, inventorySlotType.canBeLooted)

      if (itemAsString !== '') {
        if (inventorySlotAsString.length > 0) {
          inventorySlotAsString += '\n'
        }

        inventorySlotAsString += `[${italicToken}${this.translate('caption.slotType' + StringUtils.toUpperFirst(inventorySlotType.id), options.language)}${italicToken}] ${itemAsString}`
      }
    }

    return inventorySlotAsString
  }

  /**
   * Gets the armor modifiers of an armor or vest inventory slot.
   * @param inventorySlot - Inventory slot.
   */
  private async getArmorModifiersAsync(inventorySlot: IInventorySlot): Promise<IArmorModifiers> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== InventorySlotTypeId.bodyArmor
        && inventorySlot.typeId !== InventorySlotTypeId.headwear
        && inventorySlot.typeId !== InventorySlotTypeId.tacticalRig)) {
      return {
        armorClass: 0,
        durability: 0
      }
    }

    const inventoryItemArmorModifiers = await Services.get(InventoryItemService).getArmorModifiersAsync(inventorySlot.items[0])

    return inventoryItemArmorModifiers
  }

  /**
   * Gets the ergonomics of a ranged weapon inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Ergonomics or undefined if the slot doesn't contain a ranged weapon.
   */
  private async getErgonomicsAsync(inventorySlot: IInventorySlot): Promise<number> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== InventorySlotTypeId.holster
        && inventorySlot.typeId !== InventorySlotTypeId.onBack
        && inventorySlot.typeId !== InventorySlotTypeId.onSling)) {
      return 0
    }

    const inventoryItemErgonomics = await Services.get(InventoryItemService).getErgonomicsAsync(inventorySlot.items[0])

    return inventoryItemErgonomics.ergonomicsWithMods
  }

  /**
   * Gets the price of all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @param canBeLooted - Indicates whether items contained in the inventory slot can be looted or not.
   * @returns Price.
   */
  private async getPriceAsync(inventorySlot: IInventorySlot, canBeLooted: boolean): Promise<IInventoryPrice> {
    const inventoryItemService = Services.get(InventoryItemService)
    const inventorySlotPrice: IInventoryPrice = {
      missingPrice: false,
      priceByCurrency: [],
      priceInMainCurrency: 0
    }

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const inventoryItemPrice = await inventoryItemService.getPriceAsync(inventoryItem, undefined, canBeLooted)
      inventorySlotPrice.missingPrice = inventoryItemPrice.missingPrice

      for (const inventoryItemPriceWithContent of inventoryItemPrice.pricesWithContent) {
        const currencyIndex = inventorySlotPrice.priceByCurrency.findIndex(p => p.currencyName === inventoryItemPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventorySlotPrice.priceByCurrency.push(inventoryItemPriceWithContent)
        } else {
          inventorySlotPrice.priceByCurrency[currencyIndex].value += inventoryItemPriceWithContent.value
          inventorySlotPrice.priceByCurrency[currencyIndex].valueInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
        }

        inventorySlotPrice.priceInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
      }
    }

    if (inventorySlotPrice.priceByCurrency.length > 1) {
      // Sorting currencies in the price detailed by currency
      inventorySlotPrice.priceByCurrency = PriceUtils.sortByCurrency(inventorySlotPrice.priceByCurrency)
    }

    return inventorySlotPrice
  }

  /**
   * Gets the recoil of a ranged weapon inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Recoil or undefined if the slot doesn't contain a ranged weapon.
   */
  private async getRecoilAsync(inventorySlot: IInventorySlot): Promise<IRecoil> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== InventorySlotTypeId.holster
        && inventorySlot.typeId !== InventorySlotTypeId.onBack
        && inventorySlot.typeId !== InventorySlotTypeId.onSling)) {
      return {
        horizontalRecoil: 0,
        verticalRecoil: 0
      }
    }

    const inventoryItemRecoil = await Services.get(InventoryItemService).getRecoilAsync(inventorySlot.items[0])

    return {
      horizontalRecoil: inventoryItemRecoil.horizontalRecoilWithMods,
      verticalRecoil: inventoryItemRecoil.verticalRecoilWithMods
    }
  }

  /**
   * Gets the the modifiers from wearable inventory slots.
   * @param inventorySlot - Inventory slot.
   * @returns Wearable modifiers.
   */
  private async getWearableModifiersAsync(inventorySlot: IInventorySlot): Promise<IWearableModifiers> {
    const inventoryItemService = Services.get(InventoryItemService)
    const inventorySlotWearableModifiers: IWearableModifiers = {
      ergonomicsModifierPercentage: 0,
      movementSpeedModifierPercentage: 0,
      turningSpeedModifierPercentage: 0
    }

    if (inventorySlot.typeId !== InventorySlotTypeId.backpack
      && inventorySlot.typeId !== InventorySlotTypeId.bodyArmor
      && inventorySlot.typeId !== InventorySlotTypeId.headwear
      && inventorySlot.typeId !== InventorySlotTypeId.tacticalRig) {
      return inventorySlotWearableModifiers
    }

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const inventoryItemWearableModifiers = await inventoryItemService.getWearableModifiersAsync(inventoryItem)
      inventorySlotWearableModifiers.ergonomicsModifierPercentage += inventoryItemWearableModifiers.ergonomicsModifierPercentage
      inventorySlotWearableModifiers.movementSpeedModifierPercentage += inventoryItemWearableModifiers.movementSpeedModifierPercentage
      inventorySlotWearableModifiers.turningSpeedModifierPercentage += inventoryItemWearableModifiers.turningSpeedModifierPercentage
    }

    return inventorySlotWearableModifiers
  }

  /**
   * Gets the weight all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Weight.
   */
  private async getWeightAsync(inventorySlot: IInventorySlot): Promise<number> {
    const inventoryItemService = Services.get(InventoryItemService)
    let inventorySlotWeight = 0

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const inventoryItemWeight = await inventoryItemService.getWeightAsync(inventoryItem)
      inventorySlotWeight += inventoryItemWeight.weightWithContent
    }

    return inventorySlotWeight
  }

  /**
   * Translates a caption.
   * @param caption - Caption.
   * @param language - Language.
   * @returns Translated caption.
   */
  private translate(caption: string, language: string): string {
    // @ts-expect-error - For some reason, this signature of vueI18n.t() is not recognized while it really exists
    return vueI18n.t(caption, 1, { 'locale': language })
  }
}