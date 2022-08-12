import { ItemPropertiesService } from './ItemPropertiesService'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import Services from './repository/Services'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IWeight } from '../models/utils/IWeight'
import { IMod } from '../models/item/IMod'
import { IErgonomics } from '../models/utils/IErgonomics'
import { IErgonomicsPercentageModifier } from '../models/utils/IErgonomicsPercentageModifier'
import { IArmor } from '../models/item/IArmor'
import { IRecoilPercentageModifier } from '../models/utils/IRecoilPercentageModifier'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import { IRecoil } from '../models/utils/IRecoil'
import { IAmmunitionCount } from '../models/utils/IAmmunitionCount'
import Result, { FailureType } from '../utils/Result'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { ItemService } from './ItemService'
import { IAmmunition } from '../models/item/IAmmunition'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IPrice } from '../models/item/IPrice'
import { MerchantFilterService } from './MerchantFilterService'
import { PathUtils } from '../utils/PathUtils'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'

/**
 * Represents a service responsible for managing inventory items.
 */
export class InventoryItemService {
  /**
   * Gets the ammunition counts of an item including its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Ammunition counts.
   */
  public async getAmmunitionCounts(inventoryItem: IInventoryItem): Promise<Result<IAmmunitionCount[]>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    const ammunitionCounts: IAmmunitionCount[] = []

    if (Services.get(ItemPropertiesService).isAmmunition(itemResult.value)) {
      const ammunition = itemResult.value as IAmmunition
      ammunitionCounts.push({
        id: ammunition.id,
        count: inventoryItem.quantity,
        name: ammunition.name
      })
    }

    // Getting ammunitions counts for the content of the item
    for (const contentItem of inventoryItem.content) {
      const contentItemAmmunitionCountsResult = await this.getAmmunitionCounts(contentItem)

      if (!contentItemAmmunitionCountsResult.success) {
        return Result.failFrom(contentItemAmmunitionCountsResult, FailureType.error)
      }

      for (const contentItemAmmunitionCount of contentItemAmmunitionCountsResult.value) {
        const index = ammunitionCounts.findIndex((ac) => ac.id === contentItemAmmunitionCount.id)

        if (index >= 0) {
          ammunitionCounts[index].count += contentItemAmmunitionCount.count
        } else {
          ammunitionCounts.push(contentItemAmmunitionCount)
        }
      }
    }

    // Getting ammunitions counts for the mods of the item
    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modAmmunitionCountsResult = await this.getAmmunitionCounts(modSlot.item)

      if (!modAmmunitionCountsResult.success) {
        return Result.failFrom(modAmmunitionCountsResult, FailureType.error)
      }

      for (const modAmmunitionCount of modAmmunitionCountsResult.value) {
        const index = ammunitionCounts.findIndex((ac) => ac.id === modAmmunitionCount.id)

        if (index >= 0) {
          ammunitionCounts[index].count += modAmmunitionCount.count
        } else {
          ammunitionCounts.push(modAmmunitionCount)
        }
      }
    }

    return Result.ok(ammunitionCounts)
  }

  /**
   * Gets the ergonomics of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Ergonomics.
   */
  public async getErgonomics(inventoryItem: IInventoryItem): Promise<Result<IErgonomics>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    const itemPropertiesService = Services.get(ItemPropertiesService)
    let ergonomics = 0

    if (itemPropertiesService.isRangedWeapon(itemResult.value)) {
      ergonomics = (itemResult.value as IRangedWeapon).ergonomics
    } else if (itemPropertiesService.isMod(itemResult.value)) {
      ergonomics = (itemResult.value as IMod).ergonomicsModifier
    }

    let ergonomicsWithMods = ergonomics

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modErgonomicsResult = await this.getErgonomics(modSlot.item)

      if (!modErgonomicsResult.success) {
        return Result.failFrom(modErgonomicsResult, FailureType.error)
      }

      ergonomicsWithMods += modErgonomicsResult.value.ergonomicsWithMods
    }

    return Result.ok({
      ergonomics,
      ergonomicsWithMods
    })
  }

  /**
   * Gets the ergonomics percentage modifier of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Ergonomics percentage modifier.
   */
  public async getErgonomicsPercentageModifier(inventoryItem: IInventoryItem): Promise<Result<IErgonomicsPercentageModifier>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    if (!Services.get(ItemPropertiesService).isArmor(itemResult.value)) {
      return Result.ok({
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithContent: 0
      })
    }

    const ergonomicsPercentageModifier = (itemResult.value as IArmor).ergonomicsPercentageModifier
    let ergonomicsPercentageModifierWithContent = ergonomicsPercentageModifier

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modErgonomicsPercentageModifierResult = await this.getErgonomicsPercentageModifier(
        modSlot.item
      )

      if (!modErgonomicsPercentageModifierResult.success) {
        return Result.failFrom(
          modErgonomicsPercentageModifierResult,
          FailureType.error
        )
      }

      ergonomicsPercentageModifierWithContent += modErgonomicsPercentageModifierResult.value.ergonomicsPercentageModifierWithContent
    }

    return Result.ok({
      ergonomicsPercentageModifier,
      ergonomicsPercentageModifierWithContent
    })
  }

  /**
   * Gets the price of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @param presetModSlotItem - Preset mod slot item used to ignore the price of mods that are installed by default on an item.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @returns Price.
   */
  public async getPrice(inventoryItem: IInventoryItem, presetModSlotItem?: IInventoryItem, canBeLooted = true): Promise<Result<IInventoryPrice>> {
    const merchantFilterService = Services.get(MerchantFilterService)
    const itemService = Services.get(ItemService)
    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    let unitPrice: IPrice = {
      barterItems: [],
      currencyName: 'RUB',
      merchant: undefined,
      merchantLevel: undefined,
      questId: undefined,
      value: 0,
      valueInMainCurrency: 0
    }

    let unitPriceIgnoreStatus = IgnoredUnitPrice.notIgnored

    if (!canBeLooted) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.notLootable
    } else if (presetModSlotItem?.itemId === inventoryItem.itemId) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (inventoryItem.ignorePrice) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.manuallyIgnored
    }

    if (unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored) {
      for (const price of merchantFilterService.getMatchingPrices(itemResult.value)) {
        if (unitPrice.valueInMainCurrency === 0 || price.valueInMainCurrency < unitPrice.valueInMainCurrency) {
          unitPrice = price
        }
      }
    }

    const price: IPrice = {
      barterItems: [], // TODO : Handling barters
      currencyName: unitPrice.currencyName,
      merchant: unitPrice.merchant,
      merchantLevel: unitPrice.merchantLevel,
      questId: unitPrice.questId,
      value: unitPrice.value * inventoryItem.quantity,
      valueInMainCurrency: unitPrice.valueInMainCurrency * inventoryItem.quantity
    }

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return Result.failFrom(mainCurrencyResult)
    }

    const inventoryPrice: IInventoryPrice = {
      missingPrice: unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored && !merchantFilterService.hasMatchingPrices(itemResult.value, false),
      price,
      pricesWithContent: [],
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        merchant: undefined,
        merchantLevel: undefined,
        questId: undefined,
        value: price.valueInMainCurrency,
        valueInMainCurrency: price.valueInMainCurrency
      },
      unitPrice,
      unitPriceIgnoreStatus
    }

    if (price.valueInMainCurrency > 0) {
      inventoryPrice.pricesWithContent.push({
        barterItems: [], // TODO : Handling barters
        currencyName: price.currencyName,
        merchant: undefined,
        merchantLevel: undefined,
        questId: price.questId,
        value: price.value,
        valueInMainCurrency: price.valueInMainCurrency
      })
    }

    for (const containedItem of inventoryItem.content) {
      /* istanbul ignore if */
      if (containedItem == undefined) {
        // !!! WORKAROUNG !! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }

      const containedItemPriceResult = await this.getPrice(containedItem)

      if (!containedItemPriceResult.success) {
        return Result.failFrom(containedItemPriceResult, FailureType.error)
      }

      for (const containedItemPriceWithContent of containedItemPriceResult.value.pricesWithContent) {
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === containedItemPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(containedItemPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += containedItemPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += containedItemPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency.value += containedItemPriceWithContent.valueInMainCurrency
        inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency += containedItemPriceWithContent.valueInMainCurrency
      }

      if (containedItemPriceResult.value.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (presetModSlotItem === undefined) {
      presetModSlotItem = await itemService.getPreset(inventoryItem.itemId)
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const presetModSlot = presetModSlotItem?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const modPriceResult = await this.getPrice(modSlot.item, presetModSlot?.item)

      if (!modPriceResult.success) {
        return Result.failFrom(modPriceResult, FailureType.error)
      }

      for (const modPriceWithContent of modPriceResult.value.pricesWithContent) {
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === modPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(modPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += modPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += modPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency.value += modPriceWithContent.valueInMainCurrency
        inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency += modPriceWithContent.valueInMainCurrency
      }

      if (modPriceResult.value.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    return Result.ok(inventoryPrice)
  }

  /**
   * Gets the recoil of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Recoil.
   */
  public async getRecoil(inventoryItem: IInventoryItem): Promise<Result<IRecoil>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    if (!Services.get(ItemPropertiesService).isRangedWeapon(itemResult.value)) {
      return Result.ok({
        horizontalRecoil: 0,
        horizontalRecoilWithMods: 0,
        verticalRecoil: 0,
        verticalRecoilWithMods: 0
      })
    }

    const horizontalRecoil = (itemResult.value as IRangedWeapon).horizontalRecoil
    const verticalRecoil = (itemResult.value as IRangedWeapon).verticalRecoil
    const recoil: IRecoil = {
      horizontalRecoil,
      horizontalRecoilWithMods: horizontalRecoil,
      verticalRecoil,
      verticalRecoilWithMods: verticalRecoil
    }

    // Getting the chambered or in magazine ammunition recoil percentage modifier
    const chamberedAmmunitionRecoilPercentageModifierResult = await this.getChamberedAmmunitionRecoilPercentageModifier(itemResult.value, inventoryItem.modSlots)

    if (!chamberedAmmunitionRecoilPercentageModifierResult.success) {
      return Result.failFrom(
        chamberedAmmunitionRecoilPercentageModifierResult,
        FailureType.error
      )
    }

    const chamberedAmmunitionRecoilPercentageModifier = chamberedAmmunitionRecoilPercentageModifierResult.value

    // Getting the recoil percentage modifier for each mods
    let modsRecoilPercentageModifiers = 0

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modRecoilPercentageModifierResult = await this.getRecoilPercentageModifier(modSlot.item)

      if (!modRecoilPercentageModifierResult.success) {
        return Result.failFrom(modRecoilPercentageModifierResult, FailureType.error)
      }

      modsRecoilPercentageModifiers += modRecoilPercentageModifierResult.value.recoilPercentageModifierWithMods
    }

    // Applying to the weapon recoil the recoil percentage modifiers of its mods
    recoil.horizontalRecoilWithMods = Math.round(recoil.horizontalRecoil + (recoil.horizontalRecoil * modsRecoilPercentageModifiers / 100))
    recoil.horizontalRecoilWithMods += Math.round(recoil.horizontalRecoilWithMods * chamberedAmmunitionRecoilPercentageModifier / 100)
    recoil.verticalRecoilWithMods = Math.round(recoil.verticalRecoil + (recoil.verticalRecoil * modsRecoilPercentageModifiers / 100))
    recoil.verticalRecoilWithMods += Math.round(recoil.verticalRecoilWithMods * chamberedAmmunitionRecoilPercentageModifier / 100)

    return Result.ok(recoil)
  }

  /**
   * Gets the recoil modifier of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Recoil percentage modifier.
   */
  public async getRecoilPercentageModifier(inventoryItem: IInventoryItem): Promise<Result<IRecoilPercentageModifier>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    const itemPropertiesService = Services.get(ItemPropertiesService)
    const recoilPercentageModifier: IRecoilPercentageModifier = {
      recoilPercentageModifier: 0,
      recoilPercentageModifierWithMods: 0
    }

    if (!itemPropertiesService.isMod(itemResult.value)) {
      return Result.ok(recoilPercentageModifier)
    }

    if (itemPropertiesService.isRangedWeaponMod(itemResult.value)) {
      recoilPercentageModifier.recoilPercentageModifier = (itemResult.value as IRangedWeaponMod).recoilPercentageModifier
      recoilPercentageModifier.recoilPercentageModifierWithMods = recoilPercentageModifier.recoilPercentageModifier
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modRecoilPercentageModifierResult = await this.getRecoilPercentageModifier(modSlot.item)

      if (!modRecoilPercentageModifierResult.success) {
        return Result.failFrom(
          modRecoilPercentageModifierResult,
          FailureType.error
        )
      }

      recoilPercentageModifier.recoilPercentageModifierWithMods +=
        modRecoilPercentageModifierResult.value.recoilPercentageModifierWithMods
    }

    return Result.ok(recoilPercentageModifier)
  }

  /**
   * Gets the weight of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Weight.
   */
  public async getWeight(inventoryItem: IInventoryItem): Promise<Result<IWeight>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult, FailureType.error)
    }

    const weight = itemResult.value.weight * inventoryItem.quantity
    let weightWithContent = weight

    for (const containedItem of inventoryItem.content) {
      /* istanbul ignore if */
      if (containedItem == undefined) {
        // !!! WORKAROUNG !! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }

      const containedItemWeightResult = await this.getWeight(containedItem)

      if (!containedItemWeightResult.success) {
        return Result.failFrom(containedItemWeightResult, FailureType.error)
      }

      weightWithContent += containedItemWeightResult.value.weightWithContent
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item === undefined) {
        continue
      }

      const modWeightResult = await this.getWeight(modSlot.item)

      if (!modWeightResult.success) {
        return Result.failFrom(modWeightResult, FailureType.error)
      }

      weightWithContent += modWeightResult.value.weightWithContent
    }

    return Result.ok({
      weight: +weight.toFixed(3), // toFixed() used to avoir floating point imprecision, + used to transform it back to number
      weightWithContent: +weightWithContent.toFixed(3), // toFixed() used to avoir floating point imprecision, + used to transform it back to number
      unitWeight: +itemResult.value.weight.toFixed(3) // toFixed() used to avoir floating point imprecision, + used to transform it back to number
    })
  }

  /**
   * Gets the preset mod slot the inventory item is a part of.
   * @param itemId - Item ID.
   * @param path - Mod slot path indicating the inventory object position within a parent item.
   * @returns Preset mod slot if the inventory item is in a preset; otherwise undefined.
   */
  public async getPresetModSlotContainingItem(itemId: string, path: string): Promise<IInventoryModSlot | undefined> {
    const pathArray = path.split('/')

    // Getting the last item of the path that appears before mods.
    // We should never have the case of a mod that have items in its content that have mods.
    const firstModIndex = pathArray.findIndex(p => p.startsWith(PathUtils.modSlotPrefix))

    if (firstModIndex < 0) {
      return undefined
    }

    const presetId = pathArray[firstModIndex - 1].replace(PathUtils.itemPrefix, '')
    const preset = await Services.get(ItemService).getPreset(presetId)

    if (preset === undefined) {
      return undefined
    }

    const pathModSlotNames = pathArray.filter(p => p.startsWith(PathUtils.modSlotPrefix)).map(p => p.replace(PathUtils.modSlotPrefix, ''))
    const presetModSlot = this.getPresetModSlot(preset, pathModSlotNames)

    if (presetModSlot?.item?.itemId === itemId) {
      return presetModSlot
    }
  }

  /**
   * Gets the recoil percentage modifier of the chambered ammunition (or contained in the magazine when not having a chamber)
   * of a ranged weapon.
   * @param item - Item being checked.
   * @param modSlotName - Name of the mod slot being checked on the inventory item.
   * @param modSlotItem - Item contained in the mod slot being checked on the inventory item.
   * @returns Recoil percentage modifier.
   */
  private async getChamberedAmmunitionRecoilPercentageModifier(item: IItem, modSlots: IInventoryModSlot[]): Promise<Result<number>> {
    const rangedWeapon = item as IRangedWeapon
    let ammunitionId: string | undefined

    const chamber = rangedWeapon.modSlots.find((ms) => ms.name.startsWith('chamber'))

    for (const modSlot of modSlots) {
      if (chamber !== undefined && modSlot.modSlotName === chamber.name && modSlot.item !== undefined) {
        ammunitionId = modSlot.item.itemId

        break
      } else {
        const magazine = rangedWeapon.modSlots.find((ms) => ms.name === 'mod_magazine')

        if (modSlot.modSlotName !== /* istanbul ignore next */magazine?.name || modSlot.item === undefined) {
          continue
        }

        if (modSlot.item.content.length === 0 && modSlot.item.modSlots.length > 0) {
          // The magazine is composed of multiple slots that each receive a cartridge (revolver cylinder magazine)
          ammunitionId = modSlot.item.modSlots.filter(ms => ms.item !== undefined)[0]?.item?.itemId
        } else {
          // Normal magazine
          ammunitionId = modSlot.item.content[0]?.itemId
        }
      }
    }

    if (ammunitionId === undefined) {
      return Result.ok(0)
    }

    const ammunitionResult = await Services.get(ItemService).getItem(ammunitionId)

    if (!ammunitionResult.success) {
      return Result.failFrom(ammunitionResult, FailureType.error)
    }

    return Result.ok((ammunitionResult.value as IAmmunition).recoilPercentageModifier)
  }

  /**
   * Gets the mod slot of a preset corresponding to a mod slot path.
   * @param presetInventoryItem - Preset.
   * @param pathModSlotNames - Names of the mod slots present in a path leading to a mod.
   * @returns Mod slot path corresponding to the mod slot path.
   */
  private getPresetModSlot(presetInventoryItem: IInventoryItem, pathModSlotNames: string[]): IInventoryModSlot | undefined {
    const presetModSlot = presetInventoryItem.modSlots.find(ms => ms.modSlotName === pathModSlotNames[0])

    if (presetModSlot === undefined) {
      return undefined
    }

    if (pathModSlotNames.length > 1) {
      /* istanbul ignore else */
      if (presetModSlot.item !== undefined) {
        pathModSlotNames.splice(0, 1)

        return this.getPresetModSlot(presetModSlot.item, pathModSlotNames)
      } else {
        // We should never have a preset that has an empty mod slot
        return undefined
      }
    }

    return presetModSlot
  }
}