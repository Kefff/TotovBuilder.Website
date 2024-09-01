/* eslint-disable no-irregular-whitespace */ // Special character used to force markdown to take into account spaces
import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IConflictingItem } from '../models/configuration/IConflictingItem'
import { IVest } from '../models/item/IVest'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { BuildsToTextType, IBuildsToTextOptions } from '../models/utils/IBuildsToTextOptions'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import vueI18n from '../plugins/vueI18n'
import { PathUtils } from '../utils/PathUtils'
import { PriceUtils } from '../utils/PriceUtils'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import StringUtils from '../utils/StringUtils'
import { BuildService } from './BuildService'
import { GlobalFilterService } from './GlobalFilterService'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotPropertiesService } from './InventorySlotPropertiesService'
import { InventorySlotService } from './InventorySlotService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { ItemService } from './ItemService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of a build.
 */
export class BuildPropertiesService {
  /**
   * Checks if a build contains an armored vest preventing the usage of an armor.
   * Displays a warnng notification when it is the case.
   * @param build - Build.
   */
  public async canAddArmor(build: IBuild): Promise<boolean> {
    const itemService = Services.get(ItemService)
    const vestSlot = build.inventorySlots.find((is) => is.typeId === 'tacticalRig')!

    if (vestSlot.items[0] == null) {
      return true
    }

    const item = await itemService.getItem(vestSlot.items[0].itemId)
    const vest = item as IVest

    if (vest.armorClass > 0) {
      Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.cannotAddBodyArmor'))

      return false
    }

    return true
  }

  /**
   * Checks if a mod can be added to an item by recursively checking if it appears in any of the conflicting items list of each of the children mods already added.
   * Displays a warnng notification when it is the case.
   * @param build - Build.
   * @param modId - ID of the mod to be added.
   * @param path - Path to the mod slot the mod is being added in. Used to ignore conflicts with the mod being replaced in this slot.
   */
  public async canAddMod(build: IBuild, modId: string, path: string): Promise<boolean> {
    const itemService = Services.get(ItemService)
    const mod = await itemService.getItem(modId)

    const firstItemPath = path.slice(0, path.indexOf('/' + PathUtils.modSlotPrefix))
    const inventoryItem = PathUtils.getInventoryItemFromPath(build, firstItemPath)
    const changedModSlotPath = path.slice(0, path.indexOf('/' + PathUtils.itemPrefix))
    const conflicts = await this.getConflictingItems(inventoryItem, changedModSlotPath)

    for (const conflict of conflicts) {
      if (conflict.path.startsWith(path) // Ignoring the mod (and its children mods) in the same slot that the mod being added because it is being replaced
        || (conflict.conflictingItemId !== modId // If the mod conflicts with itself, we ignore the conflict
          && !mod.conflictingItemIds.includes(conflict.itemId)) // Checking the conflicting items of the mod being added
      ) {
        continue
      }

      const conflictingItem = await itemService.getItem(conflict.itemId)
      Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.cannotAddMod', { modName: mod.name, conflictingItemName: conflictingItem.name }))

      return false
    }

    return true
  }

  /**
   * Checks if a build contains an armor preventing the usage of an armored vest.
   * Displays a warnng notification when it is the case.
   * @param build - Build.
   * @param vestId - Vest ID.
   */
  public async canAddVest(build: IBuild, vestId: string): Promise<boolean> {
    const itemService = Services.get(ItemService)
    const item = await itemService.getItem(vestId)
    const vest = item as IVest

    if (!Services.get(ItemPropertiesService).isVest(item) || vest.armorClass === 0) {
      return true
    }

    const bodyArmorInventorySlot = build.inventorySlots.find((is) => is.typeId === 'bodyArmor')

    if (bodyArmorInventorySlot?.items[0] != null) {
      Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.cannotAddTacticalRig'))

      return false
    }

    return true
  }

  /**
 * Checks whether a build summary matches a filter.
 * @param buildSummaryToCheck - Build summary that must be checked against the filter.
 * @param filter - Filter.
 */
  public checkMatchesFilter(buildSummaryToCheck: IBuildSummary, filter: string): boolean {
    const filterWords = filter.split(' ')

    for (const filterWord of filterWords) {
      if (StringUtils.contains(buildSummaryToCheck.name, filterWord)) {
        continue
      }

      let itemContains = false
      const items = buildSummaryToCheck.shoppingList.map(sli => sli.item)

      for (const item of items) {
        if (StringUtils.contains(item.shortName, filterWord)
          || StringUtils.contains(item.name, filterWord)) {
          itemContains = true
          break
        }
      }

      if (!itemContains) {
        return false
      }
    }

    return true
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
   * Gets the merchants and their maximum level from a shopping list.
   */
  public getShoppingListMerchants(shoppingList: IShoppingListItem[]): IShoppingListMerchant[] {
    const merchants: IShoppingListMerchant[] = []

    for (const item of shoppingList) {
      if (item.price.merchant === '') {
        // Happens when an item only has barters that have items with a missing price
        // This allows to display the barter to the user and to display the missing price icon on the barter items instead of the item itself
        continue
      }

      const merchant = merchants.find(m => m.name === item.price.merchant)

      if (merchant == null) {
        merchants.push({
          name: item.price.merchant,
          level: item.price.merchantLevel
        })
      } else {
        if (merchant.level < item.price.merchantLevel) {
          merchant.level = item.price.merchantLevel
        }
      }
    }

    merchants.sort((m1, m2) => StringUtils.compare(m1.name, m2.name))

    return merchants
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

    const summary: IBuildSummary = {
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


    summary.armorModifiers = this.getArmorModifiers(inventorySlotSummaries)
    summary.wearableModifiers = this.getWearableModifiers(inventorySlotSummaries)

    const summaryErgonomics = this.getErgonomics(inventorySlotSummaries)
    summary.ergonomics = summaryErgonomics * (1 + summary.wearableModifiers.ergonomicsModifierPercentage)

    summary.price = this.getPrice(inventorySlotSummaries)
    summary.recoil = this.getRecoil(inventorySlotSummaries)
    summary.weight = this.getWeight(inventorySlotSummaries)

    summary.shoppingList = await this.getShoppingList(build)

    return summary
  }

  /**
   * Convert builds to a text.
   * @param builds - Builds to convert.
   * @param options - Options.
   * @returns Text.
   */
  public async toText(builds: IBuild[], options: IBuildsToTextOptions): Promise<string> {
    const boldToken = options.type === BuildsToTextType.markdown ? '**' : ''
    const italicToken = options.type === BuildsToTextType.markdown ? '*' : ''
    const lineEnd = options.type === BuildsToTextType.markdown ? '  ' : ''

    const itemService = Services.get(ItemService)
    const buildService = Services.get(BuildService)
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)

    let buildsAsString = ''
    const mainCurrency = itemService.getMainCurrency()

    for (const build of builds) {
      const sharableUrlResult = await buildService.toSharableURL(build)

      if (options.linkOnly) {
        if (options.type === BuildsToTextType.markdown) {
          if (buildsAsString !== '') {
            buildsAsString += '\n'
          }

          buildsAsString += `[${build.name}](${sharableUrlResult})`
        } else {
          if (buildsAsString !== '') {
            buildsAsString += '\n\n\n\n'
          }

          buildsAsString += `${build.name}
${sharableUrlResult}`
        }

        continue
      }

      let buildAsString = `${options.type === BuildsToTextType.markdown ? '# ' : ''}${build.name}`
      const buildSummary = await this.getSummary(build)

      if (options.type === BuildsToTextType.markdown && sharableUrlResult != null) {
        // Build link
        buildAsString += `\n\n${italicToken}[${this.translate('caption.interactiveVersionWithFullStats', options.language)}](${sharableUrlResult})${italicToken}`
      }

      const hasArmor = buildSummary.armorModifiers.armorClass !== 0
      const hasErgonomics = buildSummary.ergonomics !== 0
      const hasErgonomicsModifierPercentage = buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0
      const hasMovementSpeedModifierPercentage = buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0
      const hasPrice = options.includePrices && buildSummary.price.priceInMainCurrency !== 0
      const hasRecoil = buildSummary.recoil.verticalRecoil !== 0
      const hasTurningSpeedModifierPercentage = buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0
      const hasWeight = buildSummary.weight !== 0

      // Main weapon stats
      let statsAsString = ''

      if (hasRecoil || hasErgonomics || hasErgonomicsModifierPercentage) {
        if (hasRecoil) {
          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '↕️')}${this.translate('caption.verticalRecoil', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil, options.language)}${boldToken}`
          statsAsString += `   ${StringUtils.getTextStatEmoji(options.type, '↔️')}${this.translate('caption.horizontalRecoil', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil, options.language)}${boldToken}`
        }

        if (hasErgonomics) {
          if (hasRecoil) {
            statsAsString += '   '
          }

          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '✋')}${this.translate('caption.ergonomics', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, buildSummary.ergonomics, options.language)}${boldToken}`
        }

        if (hasErgonomicsModifierPercentage) {
          if (hasErgonomics) {
            statsAsString += ` (${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, options.language)}${boldToken})`
          } else {
            statsAsString += `${StringUtils.getTextStatEmoji(options.type, '✋')}${this.translate('caption.ergonomics', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, options.language)}${boldToken}`
          }
        }

        statsAsString += `${lineEnd}\n`
      }

      // Armor stats
      if (hasArmor || hasMovementSpeedModifierPercentage || hasTurningSpeedModifierPercentage) {
        if (hasArmor) {
          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '🛡️')}${this.translate('caption.armorClass', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass, options.language)}${boldToken}`
        }

        if (hasMovementSpeedModifierPercentage) {
          if (hasArmor) {
            statsAsString += '   '
          }

          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '🏃')}${this.translate('caption.speed', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage, options.language)}${boldToken}`
        }

        if (hasMovementSpeedModifierPercentage) {
          if (hasArmor || hasMovementSpeedModifierPercentage) {
            statsAsString += '   '
          }

          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '🔄')}${this.translate('caption.turningSpeed', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage, options.language)}${boldToken}`
        }

        statsAsString += `${lineEnd}\n`
      }

      // Price / weight
      if (hasPrice || hasWeight) {
        if (hasPrice) {
          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '💵')}${this.translate('caption.price', options.language)} `

          for (let i = 0; i < buildSummary.price.priceByCurrency.length; i++) {
            if (buildSummary.price.priceByCurrency.length > 1
              && i == buildSummary.price.priceByCurrency.length - 1) {
              statsAsString += ` ${this.translate('caption.and', options.language)} `
            } else if (i > 0) {
              statsAsString += ', '
            }

            const priceInCurrency = buildSummary.price.priceByCurrency[i]
            const priceCurrency = itemService.getCurrency(priceInCurrency.currencyName)
            statsAsString += `${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceInCurrency.value, options.language)}${priceCurrency.symbol}${boldToken}`
          }

          if (buildSummary.price.priceByCurrency.length > 1) {
            statsAsString += ` (= ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, buildSummary.price.priceInMainCurrency, options.language)}${mainCurrency.symbol}${boldToken})`
          }
        }

        if (hasWeight) {
          if (hasPrice) {
            statsAsString += '   '
          }

          statsAsString += `${StringUtils.getTextStatEmoji(options.type, '⚓')}${this.translate('caption.weight', options.language)} ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight, options.language)}${boldToken}`
        }

        statsAsString += lineEnd
      }

      if (statsAsString !== '') {
        buildAsString += `\n\n${statsAsString}`
      }

      // Inventory slots
      let inventorySlotsAsString = ''

      for (const inventorySlot of build.inventorySlots) {
        const inventorySlotAsString = await inventorySlotPropertiesService.toText(inventorySlot, options)

        if (inventorySlotAsString !== '') {
          if (inventorySlotsAsString !== '') {
            inventorySlotsAsString += '\n\n'
          }

          inventorySlotsAsString += inventorySlotAsString
        }
      }

      if (inventorySlotsAsString !== '') {
        buildAsString += `\n\n${inventorySlotsAsString}`
      }

      if (options.type === BuildsToTextType.simpleText) {
        // Build link
        if (sharableUrlResult != null) {
          buildAsString += `\n\n${this.translate('caption.interactiveVersionWithFullStats', options.language)}
${sharableUrlResult}`
        }
      }

      if (buildsAsString !== '') {
        buildsAsString += '\n\n\n\n'
      }

      buildsAsString += buildAsString
    }

    if (options.linkOnly) {
      return buildsAsString
    }

    // Configured merchants
    if (options.includePrices) {
      const globalFilter = Services.get(GlobalFilterService).get()
      const merchantFilters = globalFilter.merchantFilters.sort((m1, m2) => StringUtils.compare(m1.merchant, m2.merchant))

      let merchantsAsString = `${italicToken}${this.translate('caption.configuredMerchants', options.language)}${italicToken}`

      for (let i = 0; i < merchantFilters.length; i++) {
        if (i % 3 === 0) {
          merchantsAsString += `${lineEnd}\n`
        } else {
          merchantsAsString += '   '
        }

        merchantsAsString += `${this.translate('caption.merchant_' + merchantFilters[i].merchant, options.language)} ${this.getTextMerchantLevel(options.type, options.language, merchantFilters[i].enabled, merchantFilters[i].merchantLevel)}`
      }

      buildsAsString += `\n\n\n\n${merchantsAsString}${lineEnd}`
    }

    // Totov builder link
    buildsAsString += '\n\n'

    if (options.type === BuildsToTextType.markdown) {
      buildsAsString += `${italicToken}${this.translate('caption.createdWith', options.language)} [${this.translate('caption.totovBuilder', options.language)}](${window.location.origin})${italicToken}`
    } else {
      buildsAsString += `${this.translate('caption.createdWith', options.language)} ${this.translate('caption.totovBuilder', options.language)}`
    }

    return buildsAsString
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
   * @param modSlotPath - "Path" to the mod slot the inventory item is in.
   * @returns Conflicting items.
   */
  private async getConflictingItems(
    inventoryItem: IInventoryItem,
    modSlotPath: string
  ): Promise<IConflictingItem[]> {
    const itemService = Services.get(ItemService)

    const conflictingItems: IConflictingItem[] = []
    const item = await itemService.getItem(inventoryItem.itemId)

    if (item.conflictingItemIds.length > 0) {
      for (const conflictingItemId of item.conflictingItemIds) {
        conflictingItems.push({
          itemId: item.id,
          path: modSlotPath,
          conflictingItemId
        })
      }
    } else {
      conflictingItems.push({
        itemId: item.id,
        path: modSlotPath,
        conflictingItemId: undefined
      })
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item != null) {
        const modConflictingItemIds = await this.getConflictingItems(
          modSlot.item,
          modSlotPath + '/' + PathUtils.itemPrefix + inventoryItem.itemId + '/' + PathUtils.modSlotPrefix + modSlot.modSlotName
        )

        conflictingItems.push(...modConflictingItemIds)
      }
    }

    return conflictingItems
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
   * Gets the merchant level to display in a text representing a build.
   * @param type - Type of text being constructed.
   * @param language - Language.
   * @param enabled - Indicates whether the merchant is enable.
   * @param level - Merchant level.
   * @returns Merchant level.
   */
  private getTextMerchantLevel(type: BuildsToTextType, language: string, enabled: boolean, level: number): string {
    if (enabled) {
      if (level === 0) {
        return type === BuildsToTextType.markdown ? '✅' : this.translate('caption.yes', language)
      }

      switch (level) {
        case 1:
          return type === BuildsToTextType.markdown ? '1️⃣' : '1'
        case 2:
          return type === BuildsToTextType.markdown ? '2️⃣' : '2'
        case 3:
          return type === BuildsToTextType.markdown ? '3️⃣' : '3'
        case 4:
          return type === BuildsToTextType.markdown ? '4️⃣' : '4'
      }
    }

    return type === BuildsToTextType.markdown ? '❌' : this.translate('caption.no', language)
  }

  /**
   * Gets the price of a build.
   * @param inventorySlotSummaries - Inventory slot summaries.
   * @returns Price.
   */
  private getPrice(inventorySlotSummaries: IInventorySlotSummary[]): IInventoryPrice {
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

    return inventoryPrice
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
      const inventorySlotType = Services.get(InventorySlotService).getType(inventorySlot.typeId)

      for (const item of inventorySlot.items) {
        if (item == null) {
          continue
        }

        const inventoryItemShoppingList = await inventoryItemService.getShoppingList(item, inventorySlotType.canBeLooted, undefined, inventorySlotType.id)

        // Regrouping similar items
        for (const inventoryItemShoppingListItemToAdd of inventoryItemShoppingList) {
          const inventoryItemShoppingListItemIndex = shoppingList.findIndex(sli =>
            sli.item.id === inventoryItemShoppingListItemToAdd.item.id
            && sli.ignorePrice === inventoryItemShoppingListItemToAdd.ignorePrice
            && sli.missingPrice === inventoryItemShoppingListItemToAdd.missingPrice)

          if (inventoryItemShoppingListItemIndex < 0) {
            shoppingList.push(inventoryItemShoppingListItemToAdd)
          } else {
            shoppingList[inventoryItemShoppingListItemIndex].quantity += inventoryItemShoppingListItemToAdd.quantity
            shoppingList[inventoryItemShoppingListItemIndex].price.value += inventoryItemShoppingListItemToAdd.unitPrice.value * inventoryItemShoppingListItemToAdd.quantity
            shoppingList[inventoryItemShoppingListItemIndex].price.valueInMainCurrency += inventoryItemShoppingListItemToAdd.unitPrice.valueInMainCurrency * inventoryItemShoppingListItemToAdd.quantity

            if (shoppingList[inventoryItemShoppingListItemIndex].inventorySlotId == undefined
              && inventoryItemShoppingListItemToAdd.inventorySlotId != null) {
              shoppingList[inventoryItemShoppingListItemIndex].inventorySlotId = inventoryItemShoppingListItemToAdd.inventorySlotId
            }
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
