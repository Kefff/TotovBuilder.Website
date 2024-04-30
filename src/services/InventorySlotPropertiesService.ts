import { IInventorySlot } from '../models/build/IInventorySlot'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import { PriceUtils } from '../utils/PriceUtils'
import Result from '../utils/Result'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotService } from './InventorySlotService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of an inventory slot.
 */
export class InventorySlotPropertiesService {
  /**
   * Converts an inventory slot to a text.
   * @param inventorySlot - Inventory slot to convert.
   * @param language - Language.
   */
  public getAsString(inventorySlot: IInventorySlot, language: string) {
    return ''
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
        ergonomicsPercentageModifier: 0,
        movementSpeedPercentageModifier: 0,
        turningSpeedPercentageModifier: 0
      },
      weight: 0
    }

    const typeResult = Services.get(InventorySlotService).getType(inventorySlot.typeId)

    if (!typeResult.success) {
      return summary
    }

    summary.type = typeResult.value
    summary.armorModifiers = await this.getArmorModifiers(inventorySlot)
    summary.ergonomics = await this.getErgonomics(inventorySlot)

    const priceResult = await this.getPrice(inventorySlot, summary.type.canBeLooted)

    if (priceResult.success) {
      summary.price = priceResult.value
    }

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

    const armorModifiersResult = await Services.get(InventoryItemService).getArmorModifiers(inventorySlot.items[0])

    if (!armorModifiersResult.success) {
      return {
        armorClass: 0,
        durability: 0
      }
    }

    return armorModifiersResult.value
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

    const ergonomicsResult = await Services.get(InventoryItemService).getErgonomics(inventorySlot.items[0])

    if (!ergonomicsResult.success) {
      return 0
    }

    return ergonomicsResult.value.ergonomicsWithMods
  }

  /**
   * Gets the price of all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @param canBeLooted - Indicates whether items contained in the inventory slot can be looted or not.
   * @returns Price.
   */
  private async getPrice(inventorySlot: IInventorySlot, canBeLooted: boolean): Promise<Result<IInventoryPrice>> {
    const inventoryItemService = Services.get(InventoryItemService)

    const inventoryPrice: IInventoryPrice = {
      missingPrice: false,
      priceByCurrency: [],
      priceInMainCurrency: 0
    }

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const priceResult = await inventoryItemService.getPrice(inventoryItem, undefined, canBeLooted)

      if (!priceResult.success) {
        return Result.failFrom(priceResult)
      }

      for (const inventoryItemPriceWithContent of priceResult.value.pricesWithContent) {
        const currencyIndex = inventoryPrice.priceByCurrency.findIndex(p => p.currencyName === inventoryItemPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.priceByCurrency.push(inventoryItemPriceWithContent)
        } else {
          inventoryPrice.priceByCurrency[currencyIndex].value += inventoryItemPriceWithContent.value
          inventoryPrice.priceByCurrency[currencyIndex].valueInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
      }

      if (priceResult.value.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (inventoryPrice.priceByCurrency.length > 1) {
      // Sorting currencies in the price detailed by currency
      inventoryPrice.priceByCurrency = PriceUtils.sortByCurrency(inventoryPrice.priceByCurrency)
    }

    return Result.ok(inventoryPrice)
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

    const recoilResult = await Services.get(InventoryItemService).getRecoil(inventorySlot.items[0])

    if (!recoilResult.success) {
      return {
        horizontalRecoil: 0,
        verticalRecoil: 0
      }
    }

    return {
      horizontalRecoil: recoilResult.value.horizontalRecoilWithMods,
      verticalRecoil: recoilResult.value.verticalRecoilWithMods
    }
  }

  /**
   * Gets the the modifiers from wearable inventory slots.
   * @param inventorySlot - Inventory slot.
   * @returns Wearable modifiers.
   */
  private async getWearableModifiers(inventorySlot: IInventorySlot): Promise<IWearableModifiers> {
    const wearableModifiers: IWearableModifiers = {
      ergonomicsPercentageModifier: 0,
      movementSpeedPercentageModifier: 0,
      turningSpeedPercentageModifier: 0
    }

    if (inventorySlot.typeId !== 'backpack'
      && inventorySlot.typeId !== 'bodyArmor'
      && inventorySlot.typeId !== 'headwear'
      && inventorySlot.typeId !== 'tacticalRig') {
      return wearableModifiers
    }

    const inventoryItemService = Services.get(InventoryItemService)


    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const wearableeModifiersResult = await inventoryItemService.getWearableModifiers(inventoryItem)

      if (!wearableeModifiersResult.success) {
        continue
      }

      wearableModifiers.ergonomicsPercentageModifier += wearableeModifiersResult.value.ergonomicsPercentageModifierWithMods
      wearableModifiers.movementSpeedPercentageModifier += wearableeModifiersResult.value.movementSpeedPercentageModifierWithMods
      wearableModifiers.turningSpeedPercentageModifier += wearableeModifiersResult.value.turningSpeedPercentageModifierWithMods
    }

    return wearableModifiers
  }

  /**
   * Gets the weight all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Weight.
   */
  private async getWeight(inventorySlot: IInventorySlot): Promise<number> {
    const inventoryItemService = Services.get(InventoryItemService)
    let weight = 0

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const weightResult = await inventoryItemService.getWeight(inventoryItem)

      if (!weightResult.success) {
        continue
      }

      weight += weightResult.value.weightWithContent
    }

    return weight
  }
}