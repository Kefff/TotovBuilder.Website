import { IInventorySlot } from '../models/build/IInventorySlot'
import { IInventorySlotType } from '../models/build/IInventorySlotType'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { PriceUtils } from '../utils/PriceUtils'
import Result from '../utils/Result'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotService } from './InventorySlotService'
import { ItemService } from './ItemService'
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
  public async getSummary(inventorySlot: IInventorySlot): Promise<IInventorySlotSummary> {
    let type: IInventorySlotType = {
      acceptedItemCategories: [],
      canBeLooted: false,
      displayOrder: 0,
      id: '',
      itemSlotsAmount: 0
    }
    const typeResult = Services.get(InventorySlotService).getType(inventorySlot.typeId)

    if (typeResult.success) {
      type = typeResult.value
    }

    const result: IInventorySlotSummary = {
      armorModifiers: undefined,
      ergonomics: undefined,
      horizontalRecoil: undefined,
      price: {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        unitPrice: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      },
      type,
      verticalRecoil: undefined,
      wearableModifiers: {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: 0,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: 0,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: 0
      },
      weight: 0
    }

    // Armor modifiers
    const armorModifiersResult = await this.getArmorModifiers(inventorySlot)

    if (armorModifiersResult != null && armorModifiersResult.success) {
      result.armorModifiers = armorModifiersResult.value
    }

    // Ergonomics
    const ergonomicsResult = await this.getErgonomics(inventorySlot)

    if (ergonomicsResult != null && ergonomicsResult.success) {
      result.ergonomics = ergonomicsResult.value
    }

    // Wearable modifiers
    const wearableModifiersResult = await this.getWearableModifiers(inventorySlot)

    if (wearableModifiersResult != null && wearableModifiersResult.success) {
      result.wearableModifiers = wearableModifiersResult.value
    }

    // Price
    const priceResult = await this.getPrice(inventorySlot, type.canBeLooted)

    if (priceResult.success) {
      result.price = priceResult.value
    }

    // Recoil
    const recoilResult = await this.getRecoil(inventorySlot)

    if (recoilResult != null && recoilResult.success) {
      result.horizontalRecoil = recoilResult.value.horizontalRecoil
      result.verticalRecoil = recoilResult.value.verticalRecoil
    }

    // Weight
    const weightResult = await this.getWeight(inventorySlot)

    if (weightResult.success) {
      result.weight = weightResult.value
    }

    return result
  }

  /**
   * Gets the armor modifiers of an armor or vest inventory slot.
   * @param inventorySlot - Inventory slot.
   */
  private async getArmorModifiers(inventorySlot: IInventorySlot): Promise<Result<IArmorModifiers> | undefined> {
    if (inventorySlot.items[0] == null) {
      return undefined
    }

    if (inventorySlot.typeId !== 'bodyArmor' && inventorySlot.typeId !== 'tacticalRig') {
      return undefined
    }

    const armorModifiersResult = await Services.get(InventoryItemService).getArmorModifiers(inventorySlot.items[0])

    return armorModifiersResult
  }

  /**
   * Gets the ergonomics of a ranged weapon inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Ergonomics or undefined if the slot doesn't contain a ranged weapon.
   */
  private async getErgonomics(inventorySlot: IInventorySlot): Promise<Result<number> | undefined> {
    if (inventorySlot.items[0] == null) {
      return undefined
    }

    if (inventorySlot.typeId !== 'holster' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'onSling') {
      return undefined
    }

    const ergonomicsResult = await Services.get(InventoryItemService).getErgonomics(inventorySlot.items[0])

    if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    }

    return Result.ok(ergonomicsResult.value.ergonomicsWithMods)
  }

  /**
   * Gets the price of all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @param canBeLooted - Indicates whether items contained in the inventory slot can be looted or not.
   * @returns Price.
   */
  private async getPrice(inventorySlot: IInventorySlot, canBeLooted: boolean): Promise<Result<IInventoryPrice>> {
    const inventoryItemService = Services.get(InventoryItemService)
    const itemService = Services.get(ItemService)

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return Result.failFrom(mainCurrencyResult)
    }

    const inventoryPrice: IInventoryPrice = {
      missingPrice: false,
      price: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      unitPrice: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
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
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === inventoryItemPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(inventoryItemPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += inventoryItemPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency.value += inventoryItemPriceWithContent.valueInMainCurrency
        inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency += inventoryItemPriceWithContent.valueInMainCurrency
      }

      if (priceResult.value.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (inventoryPrice.pricesWithContent.length > 1) {
      inventoryPrice.pricesWithContent = PriceUtils.sortByCurrency(inventoryPrice.pricesWithContent)
    }

    return Result.ok(inventoryPrice)
  }

  /**
   * Gets the recoil of a ranged weapon inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Recoil or undefined if the slot doesn't contain a ranged weapon.
   */
  private async getRecoil(inventorySlot: IInventorySlot): Promise<Result<{ horizontalRecoil: number, verticalRecoil: number }> | undefined> {
    if (inventorySlot.items[0] == null) {
      return undefined
    }

    if (inventorySlot.typeId !== 'holster' && inventorySlot.typeId !== 'onBack' && inventorySlot.typeId !== 'onSling') {
      return undefined
    }

    const recoilResult = await Services.get(InventoryItemService).getRecoil(inventorySlot.items[0])

    if (!recoilResult.success) {
      return Result.failFrom(recoilResult)
    }

    return Result.ok({
      horizontalRecoil: recoilResult.value.horizontalRecoilWithMods,
      verticalRecoil: recoilResult.value.verticalRecoilWithMods
    })
  }

  /**
   * Gets the the modifiers from wearable inventory slots.
   * @param inventorySlot - Inventory slot.
   * @returns Wearable modifiers.
   */
  private async getWearableModifiers(inventorySlot: IInventorySlot): Promise<Result<IWearableModifiers> | undefined> {
    if (inventorySlot.typeId !== 'backpack'
      && inventorySlot.typeId !== 'bodyArmor'
      && inventorySlot.typeId !== 'headwear'
      && inventorySlot.typeId !== 'tacticalRig') {
      return undefined
    }

    const inventoryItemService = Services.get(InventoryItemService)
    const wearableModifiers: IWearableModifiers = {
      ergonomicsPercentageModifier: 0,
      ergonomicsPercentageModifierWithMods: 0,
      movementSpeedPercentageModifier: 0,
      movementSpeedPercentageModifierWithMods: 0,
      turningSpeedPercentageModifier: 0,
      turningSpeedPercentageModifierWithMods: 0
    }

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const wearableeModifiersResult = await inventoryItemService.getWearableModifiers(inventoryItem)

      if (!wearableeModifiersResult.success) {
        return Result.failFrom(wearableeModifiersResult)
      }

      wearableModifiers.ergonomicsPercentageModifierWithMods += wearableeModifiersResult.value.ergonomicsPercentageModifierWithMods
      wearableModifiers.movementSpeedPercentageModifierWithMods += wearableeModifiersResult.value.movementSpeedPercentageModifierWithMods
      wearableModifiers.turningSpeedPercentageModifierWithMods += wearableeModifiersResult.value.turningSpeedPercentageModifierWithMods
    }

    return Result.ok(wearableModifiers)
  }

  /**
   * Gets the weight all the items contained in an inventory slot.
   * @param inventorySlot - Inventory slot.
   * @returns Weight.
   */
  private async getWeight(inventorySlot: IInventorySlot): Promise<Result<number>> {
    const inventoryItemService = Services.get(InventoryItemService)
    let weight = 0

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const weightResult = await inventoryItemService.getWeight(inventoryItem)

      if (!weightResult.success) {
        return Result.failFrom(weightResult)
      }

      weight += weightResult.value.weightWithContent
    }

    return Result.ok(weight)
  }
}