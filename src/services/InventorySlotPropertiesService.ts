/* eslint-disable no-irregular-whitespace */ // Special character used to force markdown to take into account spaces
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import vueI18n from '../plugins/vueI18n'
import { PriceUtils } from '../utils/PriceUtils'
import StringUtils from '../utils/StringUtils'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotService } from './InventorySlotService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of an inventory slot.
 */
export class InventorySlotPropertiesService {
  /**
  * Converts an inventory slot to a markdown text.
  * @param inventorySlot - Inventory slot to convert.
  * @param language - Language.
  */
  public async getAsMarkdownString(inventorySlot: IInventorySlot, language: string): Promise<string> {
    let inventorySlotAsString = ''
    const inventorySlotType = Services.get(InventorySlotService).getType(inventorySlot.typeId)
    const inventoryItemService = Services.get(InventoryItemService)

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const itemAsString = await inventoryItemService.getAsMarkdownString(inventoryItem, language, undefined, undefined, inventorySlotType.canBeLooted)

      if (itemAsString !== '') {
        if (inventorySlotAsString.length > 0) {
          inventorySlotAsString += '\n'
        }

        inventorySlotAsString += `[*${this.translate('caption.slotType' + StringUtils.toUpperFirst(inventorySlotType.id), language)}*] ${itemAsString}`
      }
    }

    return inventorySlotAsString
  }

  /**
   * Converts an inventory slot to a text.
   * @param inventorySlot - Inventory slot to convert.
   * @param language - Language.
   */
  public async getAsString(inventorySlot: IInventorySlot, language: string): Promise<string> {
    let inventorySlotAsString = ''
    const inventorySlotType = Services.get(InventorySlotService).getType(inventorySlot.typeId)
    const inventoryItemService = Services.get(InventoryItemService)

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const itemAsString = await inventoryItemService.getAsString(inventoryItem, language, undefined, undefined, inventorySlotType.canBeLooted)

      if (itemAsString !== '') {
        if (inventorySlotAsString.length > 0) {
          inventorySlotAsString += '\n'
        }

        inventorySlotAsString += `[${this.translate('caption.slotType' + StringUtils.toUpperFirst(inventorySlotType.id), language)}] ${itemAsString}`
      }
    }

    return inventorySlotAsString
  }

  /**
   * Gets an inventory slot summary.
   * @param inventorySlot - Inventory slot.
   * @returns Inventory slot summary.
   */
  public async getSummary(inventorySlot: IInventorySlot): Promise<IInventorySlotSummary> {
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
        id: '',
        itemSlotsAmount: 0
      },
      wearableModifiers: {
        ergonomicsModifierPercentage: 0,
        movementSpeedModifierPercentage: 0,
        turningSpeedModifierPercentage: 0
      },
      weight: 0
    }

    summary.type = Services.get(InventorySlotService).getType(inventorySlot.typeId)
    summary.armorModifiers = await this.getArmorModifiers(inventorySlot)
    summary.ergonomics = await this.getErgonomics(inventorySlot)
    summary.price = await this.getPrice(inventorySlot, summary.type.canBeLooted)
    summary.recoil = await this.getRecoil(inventorySlot)
    summary.wearableModifiers = await this.getWearableModifiers(inventorySlot)
    summary.weight = await this.getWeight(inventorySlot)

    return summary
  }

  /**
   * Gets the armor modifiers of an armor or vest inventory slot.
   * @param inventorySlot - Inventory slot.
   */
  private async getArmorModifiers(inventorySlot: IInventorySlot): Promise<IArmorModifiers> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== 'bodyArmor'
        && inventorySlot.typeId !== 'headwear'
        && inventorySlot.typeId !== 'tacticalRig')) {
      return {
        armorClass: 0,
        durability: 0
      }
    }

    const inventoryItemArmorModifiers = await Services.get(InventoryItemService).getArmorModifiers(inventorySlot.items[0])

    return inventoryItemArmorModifiers
  }

  /**
   * Gets the ergonomics of a ranged weapon inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Ergonomics or undefined if the slot doesn't contain a ranged weapon.
   */
  private async getErgonomics(inventorySlot: IInventorySlot): Promise<number> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== 'holster' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'onSling')) {
      return 0
    }

    const inventoryItemErgonomics = await Services.get(InventoryItemService).getErgonomics(inventorySlot.items[0])

    return inventoryItemErgonomics.ergonomicsWithMods
  }

  /**
   * Gets the price of all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @param canBeLooted - Indicates whether items contained in the inventory slot can be looted or not.
   * @returns Price.
   */
  private async getPrice(inventorySlot: IInventorySlot, canBeLooted: boolean): Promise<IInventoryPrice> {
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

      const inventoryItemPrice = await inventoryItemService.getPrice(inventoryItem, undefined, canBeLooted)
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
  private async getRecoil(inventorySlot: IInventorySlot): Promise<IRecoil> {
    if (inventorySlot.items[0] == null
      || (inventorySlot.typeId !== 'holster' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'onSling')) {
      return {
        horizontalRecoil: 0,
        verticalRecoil: 0
      }
    }

    const inventoryItemRecoil = await Services.get(InventoryItemService).getRecoil(inventorySlot.items[0])

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
  private async getWearableModifiers(inventorySlot: IInventorySlot): Promise<IWearableModifiers> {
    const inventoryItemService = Services.get(InventoryItemService)
    const inventorySlotWearableModifiers: IWearableModifiers = {
      ergonomicsModifierPercentage: 0,
      movementSpeedModifierPercentage: 0,
      turningSpeedModifierPercentage: 0
    }

    if (inventorySlot.typeId !== 'backpack'
      && inventorySlot.typeId !== 'bodyArmor'
      && inventorySlot.typeId !== 'headwear'
      && inventorySlot.typeId !== 'tacticalRig') {
      return inventorySlotWearableModifiers
    }

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const inventoryItemWearableModifiers = await inventoryItemService.getWearableModifiers(inventoryItem)
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
  private async getWeight(inventorySlot: IInventorySlot): Promise<number> {
    const inventoryItemService = Services.get(InventoryItemService)
    let inventorySlotWeight = 0

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const inventoryItemWeight = await inventoryItemService.getWeight(inventoryItem)
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