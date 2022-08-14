import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IConflictingItem } from '../models/configuration/IConflictingItem'
import { IVest } from '../models/item/IVest'
import { IAmmunitionCount } from '../models/utils/IAmmunitionCount'
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

    if (vestSlot === undefined) {
      // Should never occur
      return Result.fail(
        FailureType.error,
        'BuildService.checkCanAddArmor()',
        vueI18n.t('message.modSlotNotFound', { modSlot: 'tacticalRig' })
      )
    }

    const itemService = Services.get(ItemService)

    for (const vest of vestSlot.items) {
      if (vest == undefined) {
        continue
      }

      const vestResult = await itemService.getItem(vest.itemId)

      if (!vestResult.success) {
        return Result.failFrom(vestResult, FailureType.error)
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
      return Result.failFrom(modResult, FailureType.error)
    }

    const firstItemPath = path.slice(0, path.indexOf('/' + PathUtils.modSlotPrefix))
    const inventoryItemResult = PathUtils.getInventoryItemFromPath(build, firstItemPath)

    if (!inventoryItemResult.success) {
      return Result.failFrom(inventoryItemResult, FailureType.error)
    }

    const changedModSlotPath = path.slice(0, path.indexOf('/' + PathUtils.itemPrefix))
    const conflictingItemsResult = await this.getConflictingItems(inventoryItemResult.value, changedModSlotPath)

    if (!conflictingItemsResult.success) {
      return Result.failFrom(conflictingItemsResult, FailureType.error)
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

      /* istanbul ignore if */
      if (!conflictingItemResult.success) {
        return Result.failFrom(conflictingItemResult, FailureType.error)
      }

      return Result.fail(
        FailureType.hidden,
        'BuildService.checkCanAddMod()',
        vueI18n.t('message.cannotAddMod', {
          modName: modResult.value.name,
          conflictingItemCaption: conflictingItemResult.value.name
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
      return Result.failFrom(vestResult, FailureType.error)
    }

    if ((vestResult.value as IVest).armorClass === 0) {
      return Result.ok()
    }

    const armorSlot = build.inventorySlots.find(
      (is) => is.typeId === 'bodyArmor'
    )

    if (armorSlot === undefined) {
      // Should never occur
      return Result.fail(
        FailureType.error,
        'BuildService.checkCanAddVest()',
        vueI18n.t('message.modSlotNotFound', { modSlot: 'bodyArmor' })
      )
    }

    for (const item of armorSlot.items) {
      if (item != undefined) {
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
   * Gets a list of all ammunition counts of a build.
   * @param build - Build.
   * @returns Ammunition counts.
   */
  public async getAmmunitionCounts(build: IBuild): Promise<Result<IAmmunitionCount[]>> {
    const inventoryItemService = Services.get(InventoryItemService)
    const ammunitionCounts: IAmmunitionCount[] = []

    for (const inventorySlot of build.inventorySlots) {
      for (const inventoryItem of inventorySlot.items) {
        if (inventoryItem == undefined) {
          continue
        }

        const inventoryItemAmmunitionCountsResult = await inventoryItemService.getAmmunitionCounts(inventoryItem)

        if (!inventoryItemAmmunitionCountsResult.success) {
          return Result.failFrom(inventoryItemAmmunitionCountsResult, FailureType.error)
        }

        for (const inventoryItemAmmunitionCount of inventoryItemAmmunitionCountsResult.value) {
          const index = ammunitionCounts.findIndex((ac) => ac.id === inventoryItemAmmunitionCount.id)

          if (index >= 0) {
            ammunitionCounts[index].count += inventoryItemAmmunitionCount.count
          } else {
            ammunitionCounts.push(inventoryItemAmmunitionCount)
          }
        }
      }
    }

    return Result.ok(ammunitionCounts)
  }

  /**
   * Gets the ergonomics of the main ranged weapon of a build (ergonomics percentage modifier not included).
   * @param build - Build.
   * @returns Ergonomics.
   */
  public async getErgonomics(build: IBuild): Promise<Result<number> | undefined> {
    const mainRangedWeaponInventorySlot = this.getMainRangedWeaponInventorySlot(build)

    if (mainRangedWeaponInventorySlot === undefined) {
      return undefined
    }

    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const ergonomicsResult = await inventorySlotPropertiesService.getErgonomics(mainRangedWeaponInventorySlot)

    /* istanbul ignore if */
    if (ergonomicsResult === undefined) {
      return undefined
    } else if (!ergonomicsResult.success) {
      return Result.failFrom(ergonomicsResult, FailureType.error)
    } else {
      return ergonomicsResult
    }
  }

  /**
   * Gets the ergonomics percentage modifier of a build.
   * @param build - Build.
   * @returns Ergonomics percentage modifier.
   */
  public async getErgonomicsPercentageModifier(build: IBuild): Promise<Result<number>> {
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    let ergonomicsPercentageModifier = 0

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotErgonomicsPercentageModifierResult = await inventorySlotPropertiesService.getErgonomicsPercentageModifier(inventorySlot)

      if (inventorySlotErgonomicsPercentageModifierResult === undefined) {
        continue
      }

      if (!inventorySlotErgonomicsPercentageModifierResult.success) {
        return Result.failFrom(inventorySlotErgonomicsPercentageModifierResult, FailureType.error)
      }

      ergonomicsPercentageModifier += inventorySlotErgonomicsPercentageModifierResult.value
    }

    return Result.ok(ergonomicsPercentageModifier)
  }

  /**
   * Gets the tooltip for not exported builds.
   * @param lastUpdated - Date of the last update.
   * @param lastExported - Date of the last export.
   * @returns Tooltip.
   */
  public getNotExportedTooltip(lastUpdated: Date, lastExported: Date | undefined): string {
    let tooltip: string

    if (lastUpdated !== undefined && lastExported !== undefined) {
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
        merchant: '',
        merchantLevel: 0,
        questId: '',
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        merchant: '',
        merchantLevel: 0,
        questId: '',
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      unitPrice: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        merchant: '',
        merchantLevel: 0,
        questId: '',
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    }

    for (const inventorySlot of build.inventorySlots) {
      const canBeLootedResult = inventorySlotPropertiesService.canBeLooted(inventorySlot)

      if (!canBeLootedResult.success) {
        return Result.failFrom(canBeLootedResult, FailureType.error)
      }

      const inventorySlotPriceResult = await inventorySlotPropertiesService.getPrice(inventorySlot, canBeLootedResult.value)

      if (!inventorySlotPriceResult.success) {
        return Result.failFrom(inventorySlotPriceResult, FailureType.error)
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

    if (mainRangedWeaponInventorySlot === undefined) {
      return undefined
    }

    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const recoilResult = await inventorySlotPropertiesService.getRecoil(mainRangedWeaponInventorySlot)

    /* istanbul ignore if */
    if (recoilResult === undefined) {
      return undefined
    } else if (!recoilResult.success) {
      return Result.failFrom(recoilResult, FailureType.error)
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

    const result: IBuildSummary = {
      ammunitionCounts: [],
      ergonomics: undefined,
      ergonomicsPercentageModifier: 0,
      exported: build.lastExported !== undefined && build.lastExported >= build.lastUpdated,
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
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: mainCurrencyResult.value.name,
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        unitPrice: {
          barterItems: [],
          currencyName: mainCurrencyResult.value.name,
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      },
      verticalRecoil: undefined,
      weight: 0
    }

    // Ergonomics percentage modifier
    const ergonomicsPercentageModifierResult = await this.getErgonomicsPercentageModifier(build)

    /* istanbul ignore if */
    if (!ergonomicsPercentageModifierResult.success) {
      return Result.failFrom(ergonomicsPercentageModifierResult)
    }

    result.ergonomicsPercentageModifier = ergonomicsPercentageModifierResult.value

    // Ergonomics
    const ergonomicsResult = await this.getErgonomics(build)

    if (ergonomicsResult !== undefined) {
      /* istanbul ignore if */
      if (!ergonomicsResult.success) {
        return Result.failFrom(ergonomicsResult)
      }

      result.ergonomics = Math.round(ergonomicsResult.value + (ergonomicsResult.value * result.ergonomicsPercentageModifier))
    }

    // Price
    const priceResult = await this.getPrice(build)

    /* istanbul ignore if */
    if (!priceResult.success) {
      return Result.failFrom(priceResult)
    }

    result.price = priceResult.value

    // Recoil
    const recoilResult = await this.getRecoil(build)

    if (recoilResult !== undefined) {
      /* istanbul ignore if */
      if (!recoilResult.success) {
        return Result.failFrom(recoilResult)
      }

      result.horizontalRecoil = recoilResult.value.horizontalRecoil
      result.verticalRecoil = recoilResult.value.verticalRecoil
    }

    // Weight
    const weightResult = await this.getWeight(build)

    /* istanbul ignore if */
    if (!weightResult.success) {
      return Result.failFrom(weightResult)
    }

    result.weight = weightResult.value

    // Ammunition
    const ammunitionCountsResult = await this.getAmmunitionCounts(build)

    /* istanbul ignore if */
    if (!ammunitionCountsResult.success) {
      return Result.failFrom(ammunitionCountsResult)
    }

    result.ammunitionCounts = ammunitionCountsResult.value

    return Result.ok(result)
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
        return Result.failFrom(inventorySlotWeightResult, FailureType.error)
      }

      weight += inventorySlotWeightResult.value
    }

    return Result.ok(+weight.toFixed(3)) // toFixed() used to avoir floating point imprecision, + used to transform it back to number
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
      return Result.failFrom(itemResult, FailureType.error)
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
      if (modSlot.item !== undefined) {
        const modConflictingItemIdsResult = await this.getConflictingItems(
          modSlot.item,
          modSlotPath + '/' + PathUtils.itemPrefix + inventoryItem.itemId + '/' + PathUtils.modSlotPrefix + modSlot.modSlotName
        )

        /* istanbul ignore if */
        if (!modConflictingItemIdsResult.success) {
          return modConflictingItemIdsResult
        }

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

    if (onSling !== undefined && onSling.items[0] != undefined) {
      return onSling
    }

    const onBack = build.inventorySlots.find((is) => is.typeId === 'onBack')

    if (onBack !== undefined && onBack.items[0] != undefined) {
      return onBack
    }

    const holster = build.inventorySlots.find((is) => is.typeId === 'holster')

    if (holster !== undefined && holster.items[0] != undefined) {
      return holster
    }
  }
}