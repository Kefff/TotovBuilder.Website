import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IConflictingItem } from '../models/configuration/IConflictingItem'
import { IVest } from '../models/item/IVest'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import vueI18n from '../plugins/vueI18n'
import { PathUtils } from '../utils/PathUtils'
import { PriceUtils } from '../utils/PriceUtils'
import Result, { FailureType } from '../utils/Result'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import { BuildService } from './BuildService'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotPropertiesService } from './InventorySlotPropertiesService'
import { InventorySlotService } from './InventorySlotService'
import { ItemService } from './ItemService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of a build.
 */
export class BuildPropertiesService {
  /**
   * Checks if a build contains an armored vest preventing the usage of an armor.
   * @param build - Build.
   * @returns Success if the build doesn't contain an armored vest; otherwise Failure.
   */
  public async canAddArmor(build: IBuild): Promise<Result> {
    const itemService = Services.get(ItemService)
    const vestSlot = build.inventorySlots.find((is) => is.typeId === 'tacticalRig')!

    if (vestSlot.items[0] != null) {
      const vestResult = await itemService.getItem(vestSlot.items[0].itemId)

      if (!vestResult.success) {
        return Result.failFrom(vestResult)
      }

      if ((vestResult.value as IVest).armorClass > 0) {
        return Result.fail(
          FailureType.hidden,
          'BuildService.canAddArmor()',
          vueI18n.t('message.cannotAddBodyArmor')
        )
      }
    }

    return Result.ok()
  }

  /**
   * Checks if a mod can be added to an item by recursively checking if it appears in any of the conflicting items list of each of the children mods already added.
   * @param build - Build.
   * @param modId - ID of the mod to be added.
   * @param path - Path to the mod slot the mod is being added in. Used to ignore conflicts with the mod being replaced in this slot.
   * @returns Success if the mod can be added; otherwise Failure.
   */
  public async canAddMod(build: IBuild, modId: string, path: string): Promise<Result> {
    const itemService = Services.get(ItemService)
    const modResult = await itemService.getItem(modId)

    if (!modResult.success) {
      return Result.failFrom(modResult)
    }

    const firstItemPath = path.slice(0, path.indexOf('/' + PathUtils.modSlotPrefix))
    const inventoryItemResult = PathUtils.getInventoryItemFromPath(build, firstItemPath)

    if (!inventoryItemResult.success) {
      return Result.failFrom(inventoryItemResult)
    }

    const changedModSlotPath = path.slice(0, path.indexOf('/' + PathUtils.itemPrefix))
    const conflictingItemsResult = await this.getConflictingItems(inventoryItemResult.value, changedModSlotPath)

    if (!conflictingItemsResult.success) {
      return Result.failFrom(conflictingItemsResult)
    }

    for (const conflictingItem of conflictingItemsResult.value) {
      if (
        conflictingItem.path.startsWith(path) || // Ignoring the mod (and its children mods) in the same slot that the mod being added because it is being replaced
        (conflictingItem.conflictingItemId !== modId && // Checking the conflicting items for all the other mods
          !modResult.value.conflictingItemIds.includes(conflictingItem.itemId)) // Checking the conflicting items of the mod being added
      ) {
        continue
      }

      const conflictingItemResult = await itemService.getItem(conflictingItem.itemId)

      /* c8 ignore start */
      if (!conflictingItemResult.success) {
        return Result.failFrom(conflictingItemResult)
      }
      /* c8 ignore start */

      return Result.fail(
        FailureType.hidden,
        'BuildService.canAddMod()',
        vueI18n.t('message.cannotAddMod', {
          modName: modResult.value.name,
          conflictingItemName: conflictingItemResult.value.name
        })
      )
    }

    return Result.ok()
  }

  /**
   * Checks if a build contains an armor preventing the usage of an armored vest.
   * @param build - Build.
   * @param vestId - Vest ID.
   * @returns Success if the build doesn't contain an armor; otherwise Failure.
   */
  public async canAddVest(build: IBuild, vestId: string): Promise<Result> {
    const itemService = Services.get(ItemService)
    const vestResult = await itemService.getItem(vestId)

    if (!vestResult.success) {
      return Result.failFrom(vestResult)
    }

    if ((vestResult.value as IVest).armorClass === 0) {
      return Result.ok()
    }

    const armorSlot = build.inventorySlots.find((is) => is.typeId === 'bodyArmor')!

    if (armorSlot.items[0] != null) {
      return Result.fail(
        FailureType.hidden,
        'BuildService.canAddVest()',
        vueI18n.t('message.cannotAddTacticalRig')
      )
    }

    return Result.ok()
  }

  /**
   * Converts a build to a text.
   * @param build - Build to convert.
   * @param language - Language.
   */
  public async getAsString(build: IBuild, language: string) {
    const itemService = Services.get(ItemService)

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return ''
    }

    const buildService = Services.get(BuildService)
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)

    const separator = '    |    '
    let buildAsString = build.name
    const buildSummary = await this.getSummary(build)

    const hasArmor = buildSummary.armorModifiers.armorClass !== 0
    const hasErgonomics = buildSummary.ergonomics !== 0
    const hasErgonomicsModifierPercentage = buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0
    const hasMovementSpeedModifierPercentage = buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0
    const hasPrice = buildSummary.price.priceInMainCurrency !== 0
    const hasRecoil = buildSummary.recoil.verticalRecoil !== 0
      || buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0
    const hasTurningSpeedModifierPercentage = buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0
    const hasWeight = buildSummary.weight !== 0

    // Main weapon stats
    if (hasRecoil || hasErgonomics || hasErgonomicsModifierPercentage) {
      buildAsString += '\n'

      if (hasRecoil) {
        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.verticalRecoil', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil, language)}`

        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${separator}${vueI18n.t('caption.horizontalRecoil', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil, language)}`
      }

      if (hasErgonomics) {
        if (hasRecoil) {
          buildAsString += separator
        }

        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.ergonomics', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, buildSummary.ergonomics, language)}`
      }

      if (hasErgonomicsModifierPercentage) {
        if (hasErgonomics) {
          buildAsString += ` (${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, language)})`
        } else {
          // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
          buildAsString += `${vueI18n.t('caption.ergonomics', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, language)}`
        }
      }
    }

    // Armor stats
    if (hasArmor || hasMovementSpeedModifierPercentage || hasTurningSpeedModifierPercentage) {
      buildAsString += '\n'

      if (hasArmor) {
        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.armor', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass, language)}`
      }

      if (hasMovementSpeedModifierPercentage) {
        if (hasArmor) {
          buildAsString += separator
        }

        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.speed', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage, language)}`
      }

      if (hasMovementSpeedModifierPercentage) {
        if (hasArmor || hasMovementSpeedModifierPercentage) {
          buildAsString += separator
        }

        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.turningSpeed', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage, language)}`
      }
    }

    // Price / weight
    if (hasPrice || hasWeight) {
      buildAsString += '\n'

      if (hasPrice) {
        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.price', 1, { locale: language })}: `

        for (let i = 0; i < buildSummary.price.priceByCurrency.length; i++) {
          if (buildSummary.price.priceByCurrency.length > 1
            && i == buildSummary.price.priceByCurrency.length - 1) {
            // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
            buildAsString += ` ${vueI18n.t('caption.and', 1, { locale: language })} `
          } else if (i > 0) {
            buildAsString += ', '
          }

          const priceInCurrency = buildSummary.price.priceByCurrency[i]
          const priceCurrencyResult = await itemService.getCurrency(priceInCurrency.currencyName)

          if (priceCurrencyResult.success) {
            buildAsString += `${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceInCurrency.value, language)}${priceCurrencyResult.value.symbol}`
          }
        }

        if (buildSummary.price.priceByCurrency.length > 1) {
          buildAsString += ` (= ${StatsUtils.getStandardDisplayValue(DisplayValueType.price, buildSummary.price.priceInMainCurrency, language)}${mainCurrencyResult.value.symbol})`
        }
      }

      if (hasWeight) {
        if (hasPrice) {
          buildAsString += separator
        }

        // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
        buildAsString += `${vueI18n.t('caption.weight', 1, { locale: language })}: ${StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight, language)}kg`
      }
    }

    // Inventory slots
    let inventorySlotsAsString = ''

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotAsString = await inventorySlotPropertiesService.getAsString(inventorySlot, language)

      if (inventorySlotAsString !== '') {
        inventorySlotsAsString += `
${inventorySlotAsString}`
      }
    }

    if (inventorySlotsAsString !== '') {
      buildAsString += `
${inventorySlotsAsString}`
    }

    // Link
    // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
    buildAsString += `\n\n${vueI18n.t('caption.createdWithTotovBuilder', 1, { locale: language })}`

    const sharableUrlResult = await buildService.toSharableURL(build)

    if (sharableUrlResult.success) {
      // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
      buildAsString += `\n${vueI18n.t('caption.interactiveBuildAndFullStats', 1, { locale: language })}:
${sharableUrlResult.value}`
    }

    return buildAsString
  }

  /**
   * Gets the tooltip for not exported builds.
   * @param lastUpdated - Date of the last update.
   * @param lastExported - Date of the last export.
   * @returns Tooltip.
   */
  public getNotExportedTooltip(lastUpdated: Date | undefined, lastExported: Date | undefined): string {
    let tooltip: string

    if (lastUpdated != null && lastExported != null) {
      tooltip = vueI18n.t('caption.buildLastChangesNotExported', { lastUpdated: lastUpdated.toLocaleString(), lastExported: lastExported.toLocaleString() })
    } else {
      tooltip = vueI18n.t('caption.buildNotExported')
    }

    return tooltip
  }

  /**
   * Gets a build summary.
   * @param build - Build.
   * @returns Build summary.
   */
  public async getSummary(build: IBuild): Promise<IBuildSummary> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)

    const lastExported = build.lastExported ?? new Date(1900, 1, 1)
    const lastUpdated = build.lastUpdated ?? new Date(1900, 1, 1)

    const result: IBuildSummary = {
      armorModifiers: {
        armorClass: 0,
        durability: 0
      },
      ergonomics: 0,
      exported: lastExported.getTime() >= lastUpdated.getTime(),
      id: build.id,
      name: build.name,
      lastExported: build.lastExported,
      lastUpdated: build.lastUpdated,
      price: {
        missingPrice: false,
        priceByCurrency: [],
        priceInMainCurrency: 0
      },
      shoppingList: [],
      recoil: {
        horizontalRecoil: 0,
        verticalRecoil: 0
      },
      wearableModifiers: {
        ergonomicsModifierPercentage: 0,
        movementSpeedModifierPercentage: 0,
        turningSpeedModifierPercentage: 0
      },
      weight: 0
    }
    const inventorySlotSummaries: IInventorySlotSummary[] = []

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotSummary = await inventorySlotPropertiesService.getSummary(inventorySlot)
      inventorySlotSummaries.push(inventorySlotSummary)
    }

    // Armor modifiers
    result.armorModifiers = this.getArmorModifiers(inventorySlotSummaries)

    // Wearable modifiers
    result.wearableModifiers = this.getWearableModifiers(inventorySlotSummaries)

    // Ergonomics
    const summaryErgonomics = this.getErgonomics(inventorySlotSummaries)
    result.ergonomics = summaryErgonomics * (1 + result.wearableModifiers.ergonomicsModifierPercentage)

    // Price
    const priceResult = await this.getPrice(inventorySlotSummaries)

    if (priceResult.success) {
      result.price = priceResult.value
    }

    // Recoil
    result.recoil = this.getRecoil(inventorySlotSummaries)

    // Weight
    result.weight = this.getWeight(inventorySlotSummaries)

    // Shopping list
    result.shoppingList = await this.getShoppingList(build)

    return result
  }

  /**
   * Gets the armor modifiers of an armor or vest in a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   */
  private getArmorModifiers(inventorySlotSummaries: IInventorySlotSummary[]): IArmorModifiers {
    const armorSlotSummary = inventorySlotSummaries.find(iss => iss.type.id === 'bodyArmor')

    if (armorSlotSummary != null && armorSlotSummary.armorModifiers.armorClass !== 0) {
      return armorSlotSummary.armorModifiers
    }

    const vestSlot = inventorySlotSummaries.find(iss => iss.type.id === 'tacticalRig')

    return vestSlot?.armorModifiers ?? {
      armorClass: 0,
      durability: 0
    }
  }

  /**
   * Gets the list conflicting items for an item and each of its mods.
   * Items that do not have any conflicting items still are added in the list (with an undefined conflictingItemId) to be able to be tested against the added item conflicting items list.
   * @param inventoryItem - Item.
   * @param modSlotPath -"Path" to the mod slot the inventory item is in.
   * @returns Conflicting items.
   */
  private async getConflictingItems(
    inventoryItem: IInventoryItem,
    modSlotPath: string
  ): Promise<Result<IConflictingItem[]>> {
    const itemService = Services.get(ItemService)
    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    const conflictingItems: IConflictingItem[] = []

    if (itemResult.value.conflictingItemIds.length > 0) {
      for (const conflictingItemId of itemResult.value.conflictingItemIds) {
        conflictingItems.push({
          itemId: itemResult.value.id,
          path: modSlotPath,
          conflictingItemId
        })
      }
    } else {
      conflictingItems.push({
        itemId: itemResult.value.id,
        path: modSlotPath,
        conflictingItemId: undefined
      })
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item != null) {
        const modConflictingItemIdsResult = await this.getConflictingItems(
          modSlot.item,
          modSlotPath + '/' + PathUtils.itemPrefix + inventoryItem.itemId + '/' + PathUtils.modSlotPrefix + modSlot.modSlotName
        )

        /* c8 ignore start */
        if (!modConflictingItemIdsResult.success) {
          return modConflictingItemIdsResult
        }
        /* c8 ignore stop */

        conflictingItems.push(...modConflictingItemIdsResult.value)
      }
    }

    return Result.ok(conflictingItems)
  }

  /**
   * Gets the ergonomics of the main ranged weapon of a build (ergonomics modifier percentage not included).
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Ergonomics.
   */
  private getErgonomics(inventorySlotSummaries: IInventorySlotSummary[]): number {
    const mainRangedWeaponSummary = this.getMainRangedWeaponSummary(inventorySlotSummaries)

    return mainRangedWeaponSummary?.ergonomics ?? 0
  }

  /**
   * Gets the summary of the main ranged weapon slot of a build.
   * @param inventoryItemSummaries - Inventory slot summaries.
   * @returns Main ranged weapon inventory slot summary.
   */
  private getMainRangedWeaponSummary(inventoryItemSummaries: IInventorySlotSummary[]): IInventorySlotSummary | undefined {
    let mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === 'onSling')

    if (mainRangedWeaponSummary != null && mainRangedWeaponSummary.recoil.verticalRecoil > 0) {
      return mainRangedWeaponSummary
    }

    mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === 'onBack')

    if (mainRangedWeaponSummary != null && mainRangedWeaponSummary.recoil.verticalRecoil > 0) {
      return mainRangedWeaponSummary
    }

    mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === 'holster')

    return mainRangedWeaponSummary
  }

  /**
   * Gets the price of a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Price.
   */
  private async getPrice(inventorySlotSummaries: IInventorySlotSummary[]): Promise<Result<IInventoryPrice>> {
    const inventoryPrice: IInventoryPrice = {
      missingPrice: false,
      priceInMainCurrency: 0,
      priceByCurrency: []
    }

    for (const inventorySlotSummary of inventorySlotSummaries) {
      for (const priceInCurrency of inventorySlotSummary.price.priceByCurrency) {
        const currencyIndex = inventoryPrice.priceByCurrency.findIndex(p => p.currencyName === priceInCurrency.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.priceByCurrency.push(priceInCurrency)
        } else {
          inventoryPrice.priceByCurrency[currencyIndex].value += priceInCurrency.value
          inventoryPrice.priceByCurrency[currencyIndex].valueInMainCurrency += priceInCurrency.valueInMainCurrency
        }

        inventoryPrice.priceInMainCurrency += priceInCurrency.valueInMainCurrency
      }

      if (inventorySlotSummary.price.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (inventoryPrice.priceByCurrency.length > 1) {
      inventoryPrice.priceByCurrency = PriceUtils.sortByCurrency(inventoryPrice.priceByCurrency)
    }

    return Result.ok(inventoryPrice)
  }

  /**
   * Gets the recoil of the first ranged weapon found in the on sling, on back or holter inventory slots of a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Recoil.
   */
  private getRecoil(inventorySlotSummaries: IInventorySlotSummary[]): IRecoil {
    const mainRangedWeaponSummary = this.getMainRangedWeaponSummary(inventorySlotSummaries)

    return mainRangedWeaponSummary?.recoil ?? {
      horizontalRecoil: 0,
      verticalRecoil: 0
    }
  }

  /**
   * Gets a shopping list for this item and all its content, mod and barter items that must be bought.
   * @param build - Build.
   * @returns Shopping list items.
   */
  private async getShoppingList(build: IBuild): Promise<IShoppingListItem[]> {
    const inventoryItemService = Services.get(InventoryItemService)
    const shoppingList: IShoppingListItem[] = []

    for (const inventorySlot of build.inventorySlots) {
      const typeResult = Services.get(InventorySlotService).getType(inventorySlot.typeId)

      if (!typeResult.success) {
        continue
      }

      for (const item of inventorySlot.items) {
        if (item == null) {
          continue
        }

        const shoppingListResult = await inventoryItemService.getShoppingList(item, undefined, typeResult.value.canBeLooted)

        if (!shoppingListResult.success) {
          continue
        }

        for (const shoppingListItemToAdd of shoppingListResult.value) {
          const shoppingListItemIndex = shoppingList.findIndex(sli => sli.item.id === shoppingListItemToAdd.item.id)

          if (shoppingListItemIndex < 0) {
            shoppingList.push(shoppingListItemToAdd)
          } else {
            shoppingList[shoppingListItemIndex].quantity += shoppingListItemToAdd.quantity
            shoppingList[shoppingListItemIndex].price.value += shoppingListItemToAdd.unitPrice.value * shoppingListItemToAdd.quantity
            shoppingList[shoppingListItemIndex].price.valueInMainCurrency += shoppingListItemToAdd.unitPrice.valueInMainCurrency * shoppingListItemToAdd.quantity
          }
        }
      }
    }

    return shoppingList
  }

  /**
   * Gets the ergonomics modifier percentage of a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Ergonomics modifier percentage.
   */
  private getWearableModifiers(inventorySlotSummaries: IInventorySlotSummary[]): IWearableModifiers {
    const wearableModifiers: IWearableModifiers = {
      ergonomicsModifierPercentage: 0,
      movementSpeedModifierPercentage: 0,
      turningSpeedModifierPercentage: 0
    }

    for (const inventorySlotSummary of inventorySlotSummaries) {
      wearableModifiers.ergonomicsModifierPercentage += inventorySlotSummary.wearableModifiers.ergonomicsModifierPercentage
      wearableModifiers.movementSpeedModifierPercentage += inventorySlotSummary.wearableModifiers.movementSpeedModifierPercentage
      wearableModifiers.turningSpeedModifierPercentage += inventorySlotSummary.wearableModifiers.turningSpeedModifierPercentage
    }

    return wearableModifiers
  }

  /**
   * Gets the weight of a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Weight.
   */
  private getWeight(inventorySlotSummaries: IInventorySlotSummary[]): number {
    let weight = 0

    for (const inventorySlotSummary of inventorySlotSummaries) {
      weight += inventorySlotSummary.weight
    }

    return weight
  }
}
