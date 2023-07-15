import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IConflictingItem } from '../models/configuration/IConflictingItem'
import { IVest } from '../models/item/IVest'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { ItemService } from './ItemService'
import Services from './repository/Services'
import { InventorySlotPropertiesService } from './InventorySlotPropertiesService'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { InventoryItemService } from './InventoryItemService'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { PathUtils } from '../utils/PathUtils'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { round } from 'round-ts'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { PriceUtils } from '../utils/PriceUtils'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'

/**
 * Represents a service responsible for managing properties of a build.
 */
export class BuildPropertiesService {
  /**
   * Checks if a build contains an armored vest preventing the usage of an armor.
   * @param build - Build.
   * @returns Success if the build doesn't contain an armored vest; otherwise Failure.
   */
  public async checkCanAddArmor(build: IBuild): Promise<Result> {
    const vestSlot = build.inventorySlots.find((is) => is.typeId === 'tacticalRig')

    if (vestSlot == null) {
      // Should never occur
      return Result.fail(
        FailureType.error,
        'BuildService.checkCanAddArmor()',
        vueI18n.t('message.modSlotNotFound', { modSlot: 'tacticalRig' })
      )
    }

    const itemService = Services.get(ItemService)

    for (const vest of vestSlot.items) {
      if (vest == null) {
        continue
      }

      const vestResult = await itemService.getItem(vest.itemId)

      if (!vestResult.success) {
        return Result.failFrom(vestResult)
      }

      if ((vestResult.value as IVest).armorClass > 0) {
        return Result.fail(
          FailureType.hidden,
          'BuildService.checkCanAddArmor()',
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
  public async checkCanAddMod(build: IBuild, modId: string, path: string): Promise<Result> {
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
        'BuildService.checkCanAddMod()',
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
  public async checkCanAddVest(build: IBuild, vestId: string): Promise<Result> {
    const itemService = Services.get(ItemService)
    const vestResult = await itemService.getItem(vestId)

    if (!vestResult.success) {
      return Result.failFrom(vestResult)
    }

    if ((vestResult.value as IVest).armorClass === 0) {
      return Result.ok()
    }

    const armorSlot = build.inventorySlots.find(
      (is) => is.typeId === 'bodyArmor'
    )

    if (armorSlot == null) {
      // Should never occur
      return Result.fail(
        FailureType.error,
        'BuildService.checkCanAddVest()',
        vueI18n.t('message.modSlotNotFound', { modSlot: 'bodyArmor' })
      )
    }

    for (const item of armorSlot.items) {
      if (item != null) {
        return Result.fail(
          FailureType.hidden,
          'BuildService.checkCanAddVest()',
          vueI18n.t('message.cannotAddTacticalRig')
        )
      }
    }

    return Result.ok()
  }

  /**
   * Gets the ergonomics of the main ranged weapon of a build (ergonomics percentage modifier not included).
   * @param build - Build.
   * @returns Ergonomics.
   */
  public async getErgonomics(build: IBuild): Promise<Result<number> | undefined> {
    const mainRangedWeaponInventorySlot = this.getMainRangedWeaponInventorySlot(build)

    if (mainRangedWeaponInventorySlot == null) {
      return undefined
    }

    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const ergonomicsResult = await inventorySlotPropertiesService.getErgonomics(mainRangedWeaponInventorySlot)

    /* c8 ignore start */
    if (ergonomicsResult == null) {
      return undefined
    }
    /* c8 ignore stop */
    else if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult)
    } else {
      return ergonomicsResult
    }
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
   * Gets the price of a build.
   * @param build - Build.
   * @returns Price.
   */
  public async getPrice(build: IBuild): Promise<Result<IInventoryPrice>> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
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
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
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
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    }

    for (const inventorySlot of build.inventorySlots) {
      const canBeLootedResult = inventorySlotPropertiesService.canBeLooted(inventorySlot)

      if (!canBeLootedResult.success) {
        return Result.failFrom(canBeLootedResult)
      }

      const inventorySlotPriceResult = await inventorySlotPropertiesService.getPrice(inventorySlot, canBeLootedResult.value)

      if (!inventorySlotPriceResult.success) {
        return Result.failFrom(inventorySlotPriceResult)
      }

      for (const inventorySlotPriceWithContent of inventorySlotPriceResult.value.pricesWithContent) {
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === inventorySlotPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(inventorySlotPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += inventorySlotPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += inventorySlotPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency.value += inventorySlotPriceWithContent.valueInMainCurrency
        inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency += inventorySlotPriceWithContent.valueInMainCurrency
      }

      if (inventorySlotPriceResult.value.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (inventoryPrice.pricesWithContent.length > 1) {
      inventoryPrice.pricesWithContent = PriceUtils.sortByCurrency(inventoryPrice.pricesWithContent)
    }

    return Result.ok(inventoryPrice)
  }

  /**
   * Gets the recoil of the main ranged weapon of a build.
   * @param build - Build.
   * @returns Recoil.
   */
  public async getRecoil(build: IBuild): Promise<Result<{
    horizontalRecoil: number;
    verticalRecoil: number;
  }> | undefined> {
    const mainRangedWeaponInventorySlot = this.getMainRangedWeaponInventorySlot(build)

    if (mainRangedWeaponInventorySlot == null) {
      return undefined
    }

    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const recoilResult = await inventorySlotPropertiesService.getRecoil(mainRangedWeaponInventorySlot)

    /* c8 ignore start */
    if (recoilResult == null) {
      return undefined
    }
    /* c8 ignore stop */
    else if (!recoilResult.success) {
      return Result.failFrom(recoilResult)
    } else {
      return recoilResult
    }
  }

  /**
   * Gets a build summary.
   * @param build - Build.
   * @returns Build summary.
   */
  public async getSummary(build: IBuild): Promise<Result<IBuildSummary>> {
    const itemService = Services.get(ItemService)

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return Result.failFrom(mainCurrencyResult)
    }

    const lastExported = build.lastExported ?? new Date(1900, 1, 1)
    const lastUpdated = build.lastUpdated ?? new Date(1900, 1, 1)

    const result: IBuildSummary = {
      ergonomics: undefined,
      exported: build.lastExported != null && lastExported.getTime() >= lastUpdated.getTime(),
      horizontalRecoil: undefined,
      id: build.id,
      name: build.name,
      lastExported: build.lastExported,
      lastUpdated: build.lastUpdated,
      price: {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: mainCurrencyResult.value.name,
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: mainCurrencyResult.value.name,
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
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
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      },
      shoppingList: [],
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

    // Wearable modifiers
    const wearableModifiersResult = await this.getWearableModifiers(build)

    /* c8 ignore start */
    if (!wearableModifiersResult.success) {
      return Result.failFrom(wearableModifiersResult)
    }
    /* c8 ignore stop */

    result.wearableModifiers = wearableModifiersResult.value

    // Ergonomics
    const ergonomicsResult = await this.getErgonomics(build)

    if (ergonomicsResult != null) {
      /* c8 ignore start */
      if (!ergonomicsResult.success) {
        return Result.failFrom(ergonomicsResult)
      }
      /* c8 ignore stop */

      result.ergonomics = round(ergonomicsResult.value + (ergonomicsResult.value * result.wearableModifiers.ergonomicsPercentageModifierWithMods), 1)
    }

    // Price
    const priceResult = await this.getPrice(build)

    /* c8 ignore start */
    if (!priceResult.success) {
      return Result.failFrom(priceResult)
    }
    /* c8 ignore stop */

    result.price = priceResult.value

    // Recoil
    const recoilResult = await this.getRecoil(build)

    if (recoilResult != null) {
      /* c8 ignore start */
      if (!recoilResult.success) {
        return Result.failFrom(recoilResult)
      }
      /* c8 ignore stop */

      result.horizontalRecoil = recoilResult.value.horizontalRecoil
      result.verticalRecoil = recoilResult.value.verticalRecoil
    }

    // Weight
    const weightResult = await this.getWeight(build)

    /* c8 ignore start */
    if (!weightResult.success) {
      return Result.failFrom(weightResult)
    }
    /* c8 ignore stop */

    result.weight = weightResult.value

    // Shopping list
    const shoppingListResult = await this.getShoppingList(build)

    /* c8 ignore start */
    if (!shoppingListResult.success) {
      return Result.failFrom(shoppingListResult)
    }
    /* c8 ignore stop */

    result.shoppingList = shoppingListResult.value

    return Result.ok(result)
  }

  /**
   * Gets the ergonomics percentage modifier of a build.
   * @param build - Build.
   * @returns Ergonomics percentage modifier.
   */
  public async getWearableModifiers(build: IBuild): Promise<Result<IWearableModifiers>> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const wearableModifiers: IWearableModifiers = {
      ergonomicsPercentageModifier: 0,
      ergonomicsPercentageModifierWithMods: 0,
      movementSpeedPercentageModifier: 0,
      movementSpeedPercentageModifierWithMods: 0,
      turningSpeedPercentageModifier: 0,
      turningSpeedPercentageModifierWithMods: 0
    }

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotWearableModifiersResult = await inventorySlotPropertiesService.getWearableModifiers(inventorySlot)

      if (inventorySlotWearableModifiersResult == null) {
        continue
      }

      if (!inventorySlotWearableModifiersResult.success) {
        return Result.failFrom(inventorySlotWearableModifiersResult)
      }

      wearableModifiers.ergonomicsPercentageModifier += round(inventorySlotWearableModifiersResult.value.ergonomicsPercentageModifier, 2)
      wearableModifiers.ergonomicsPercentageModifierWithMods += round(inventorySlotWearableModifiersResult.value.ergonomicsPercentageModifierWithMods, 2)
      wearableModifiers.movementSpeedPercentageModifier += round(inventorySlotWearableModifiersResult.value.movementSpeedPercentageModifier, 2)
      wearableModifiers.movementSpeedPercentageModifierWithMods += round(inventorySlotWearableModifiersResult.value.movementSpeedPercentageModifierWithMods, 2)
      wearableModifiers.turningSpeedPercentageModifier += round(inventorySlotWearableModifiersResult.value.turningSpeedPercentageModifier, 2)
      wearableModifiers.turningSpeedPercentageModifierWithMods += round(inventorySlotWearableModifiersResult.value.turningSpeedPercentageModifierWithMods, 2)
    }

    return Result.ok(wearableModifiers)
  }

  /**
   * Gets the weight of a build.
   * @param build - Build.
   * @returns Weight.
   */
  public async getWeight(build: IBuild): Promise<Result<number>> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    let weight = 0

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotWeightResult = await inventorySlotPropertiesService.getWeight(inventorySlot)

      if (!inventorySlotWeightResult.success) {
        return Result.failFrom(inventorySlotWeightResult)
      }

      weight += inventorySlotWeightResult.value
    }

    return Result.ok(round(weight, 3))
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
   * Gets the main ranged weapon of a build.
   * @param build - Build.
   * @returns Main ranged weapon inventory slot.
   */
  private getMainRangedWeaponInventorySlot(build: IBuild): IInventorySlot | undefined {
    const onSling = build.inventorySlots.find((is) => is.typeId === 'onSling')

    if (onSling != null && onSling.items[0] != null) {
      return onSling
    }

    const onBack = build.inventorySlots.find((is) => is.typeId === 'onBack')

    if (onBack != null && onBack.items[0] != null) {
      return onBack
    }

    const holster = build.inventorySlots.find((is) => is.typeId === 'holster')

    if (holster != null && holster.items[0] != null) {
      return holster
    }
  }

  /**
   * Gets a shopping list for this item and all its content, mod and barter items that must be bought.
   * @param build - Build.
   * @returns Shopping list items.
   */
  private async getShoppingList(build: IBuild): Promise<Result<IShoppingListItem[]>> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const inventoryItemService = Services.get(InventoryItemService)

    const shoppingList: IShoppingListItem[] = []

    for (const inventorySlot of build.inventorySlots) {
      const canBeLootedResult = inventorySlotPropertiesService.canBeLooted(inventorySlot)

      /* c8 ignore start */
      if (!canBeLootedResult.success) {
        return Result.failFrom(canBeLootedResult)
      }
      /* c8 ignore stop */

      for (const item of inventorySlot.items) {
        if (item == null) {
          continue
        }

        const shoppingListResult = await inventoryItemService.getShoppingList(item, undefined, canBeLootedResult.value)

        /* c8 ignore start */
        if (!shoppingListResult.success) {
          return Result.failFrom(shoppingListResult)
        }
        /* c8 ignore stop */

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

    return Result.ok(shoppingList)
  }
}
