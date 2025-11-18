/* eslint-disable no-irregular-whitespace */ // Special character used to force markdown to take into account spaces
import { IBuild } from '../models/build/IBuild'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { BuildsToTextType, IBuildsToTextOptions } from '../models/utils/IBuildsToTextOptions'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { IRecoil } from '../models/utils/IRecoil'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import vueI18n from '../plugins/vueI18n'
import { PriceUtils } from '../utils/PriceUtils'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import StringUtils from '../utils/StringUtils'
import { BuildService } from './BuildService'
import { GlobalFilterService } from './GlobalFilterService'
import { InventoryItemService } from './InventoryItemService'
import { InventorySlotPropertiesService } from './InventorySlotPropertiesService'
import { ItemService } from './ItemService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing properties of a build.
 */
export class BuildPropertiesService {
  /**
 * Checks whether a build summary matches a filter.
 * @param buildSummaryToCheck - Build summary that must be checked against the filter.
 * @param filter - Filter.
 */
  public checkMatchesFilter(buildSummaryToCheck: IBuildSummary, filter: string | undefined | null): boolean {
    const filterWords = filter == null ? [] : filter.split(' ')

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
      if (item.price == null || item.price.merchant === '') {
        // Happens when an item only has barters that have items with a missing price
        // This allows to display the barter to the user and to display the missing price icon on the barter items instead of the item itself
        continue
      }

      const merchant = merchants.find(m => m.name === item.price!.merchant)

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
   * Gets the stats of a build as a string.
   * @param buildSummary - Build summary.
   * @param options - Options.
   * @param singleLine - Indicates whether the text should be on a single line.
   */
  public getStatsAsString(buildSummary: IBuildSummary, options: IBuildsToTextOptions, singleLine: boolean = false): string {
    const itemService = Services.get(ItemService)

    const mainCurrency = itemService.getMainCurrency()
    const formattingTokens = this.getFormattingTokens(options)
    const lineEnd = singleLine ? '    ' : `${formattingTokens.lineEnd}\n`

    const hasArmor = buildSummary.armorModifiers.armorClass !== 0
    const hasErgonomics = buildSummary.ergonomics !== 0
    const hasErgonomicsModifierPercentage = buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0
    const hasMovementSpeedModifierPercentage = buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0
    const hasPrice = options.includePrices && buildSummary.price.priceByCurrency.length > 0
    const hasRecoil = buildSummary.recoil.verticalRecoil !== 0
    const hasTurningSpeedModifierPercentage = buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0
    const hasWeight = buildSummary.weight !== 0

    let statsAsString = ''

    if (hasRecoil || hasErgonomics || hasErgonomicsModifierPercentage) {
      if (hasRecoil) {
        statsAsString += `${StringUtils.getTextStatEmoji(options, '↕️')}${this.translate('caption.verticalRecoil', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil, options.language)}${formattingTokens.boldToken}`
        statsAsString += `   ${StringUtils.getTextStatEmoji(options, '↔️')}${this.translate('caption.horizontalRecoil', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil, options.language)}${formattingTokens.boldToken}`
      }

      if (hasErgonomics) {
        if (hasRecoil) {
          statsAsString += '   '
        }

        statsAsString += `${StringUtils.getTextStatEmoji(options, '✋')}${this.translate('caption.ergonomics', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, buildSummary.ergonomics, options.language)}${formattingTokens.boldToken}`
      }

      if (hasErgonomicsModifierPercentage) {
        if (hasErgonomics) {
          statsAsString += ` (${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, options.language)}${formattingTokens.boldToken})`
        } else {
          statsAsString += `${StringUtils.getTextStatEmoji(options, '✋')}${this.translate('caption.ergonomicsModifierPercentage', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage, options.language)}${formattingTokens.boldToken}`
        }
      }

      statsAsString += lineEnd
    }

    // Armor stats
    if (hasArmor || hasMovementSpeedModifierPercentage || hasTurningSpeedModifierPercentage) {
      if (hasArmor) {
        statsAsString += `${StringUtils.getTextStatEmoji(options, '🛡️')}${this.translate('caption.armorClass', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass, options.language)}${formattingTokens.boldToken}`
      }

      if (hasMovementSpeedModifierPercentage) {
        if (hasArmor) {
          statsAsString += '   '
        }

        statsAsString += `${StringUtils.getTextStatEmoji(options, '🏃')}${this.translate('caption.speed', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage, options.language)}${formattingTokens.boldToken}`
      }

      if (hasTurningSpeedModifierPercentage) {
        if (hasArmor || hasMovementSpeedModifierPercentage) {
          statsAsString += '   '
        }

        statsAsString += `${StringUtils.getTextStatEmoji(options, '🔄')}${this.translate('caption.turningSpeedModifierPercentage', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage, options.language)}${formattingTokens.boldToken}`
      }

      statsAsString += lineEnd
    }

    // Price / weight
    if (hasPrice || hasWeight) {
      if (hasPrice) {
        statsAsString += `${StringUtils.getTextStatEmoji(options, '💵')}${this.translate('caption.price', options.language)} `

        for (let i = 0; i < buildSummary.price.priceByCurrency.length; i++) {
          if (buildSummary.price.priceByCurrency.length > 1
            && i == buildSummary.price.priceByCurrency.length - 1) {
            statsAsString += ` ${this.translate('caption.and', options.language)} `
          } else if (i > 0) {
            statsAsString += ', '
          }

          const priceInCurrency = buildSummary.price.priceByCurrency[i]
          const priceCurrency = itemService.getCurrency(priceInCurrency.currencyName)
          statsAsString += `${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceInCurrency.value, options.language)}${priceCurrency.symbol}${formattingTokens.boldToken}`
        }

        if (buildSummary.price.priceByCurrency.length > 1) {
          statsAsString += ` (= ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, buildSummary.price.priceInMainCurrency, options.language)}${mainCurrency.symbol}${formattingTokens.boldToken})`
        }
      }

      if (hasWeight) {
        if (hasPrice) {
          statsAsString += '   '
        }

        statsAsString += `${StringUtils.getTextStatEmoji(options, '⚓')}${this.translate('caption.weight', options.language)} ${formattingTokens.boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight, options.language)}${formattingTokens.boldToken}`
      }

      statsAsString += formattingTokens.lineEnd
    }

    return statsAsString
  }

  /**
   * Gets a build summary.
   * @param build - Build.
   * @returns Build summary.
   */
  public async getSummaryAsync(build: IBuild): Promise<IBuildSummary> {
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
      const inventorySlotSummary = await inventorySlotPropertiesService.getSummaryAsync(inventorySlot)
      inventorySlotSummaries.push(inventorySlotSummary)
    }

    summary.armorModifiers = this.getArmorModifiers(inventorySlotSummaries)
    summary.wearableModifiers = this.getWearableModifiers(inventorySlotSummaries)

    const summaryErgonomics = this.getErgonomics(inventorySlotSummaries)
    summary.ergonomics = summaryErgonomics * (1 + summary.wearableModifiers.ergonomicsModifierPercentage)

    summary.price = this.getPrice(inventorySlotSummaries)
    summary.recoil = this.getRecoil(inventorySlotSummaries)
    summary.weight = this.getWeight(inventorySlotSummaries)

    summary.shoppingList = await this.getShoppingListAsync(build)

    return summary
  }

  /**
   * Convert builds to a text.
   * @param builds - Builds to convert.
   * @param options - Options.
   * @returns Text.
   */
  public async toTextAsync(builds: IBuild[], options: IBuildsToTextOptions): Promise<string> {
    const buildService = Services.get(BuildService)
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)

    const formattingTokens = this.getFormattingTokens(options)

    let buildsAsString = ''
    const includeLink = options.linkOnly || options.includeLink

    for (const build of builds) {
      const sharableUrl = includeLink ? await buildService.toSharableUrlAsync(build) : undefined

      if (options.linkOnly) {
        if (options.type === BuildsToTextType.markdown) {
          if (buildsAsString !== '') {
            buildsAsString += '\n'
          }

          buildsAsString += `[${build.name}](${sharableUrl})`
        } else {
          if (buildsAsString !== '') {
            buildsAsString += '\n\n\n\n'
          }

          buildsAsString += `${build.name}
${sharableUrl}`
        }

        continue
      }

      let buildAsString = `${options.type === BuildsToTextType.markdown ? '# ' : ''}${build.name}`
      const buildSummary = await this.getSummaryAsync(build)

      if (options.type === BuildsToTextType.markdown && sharableUrl != null) {
        // Build link
        buildAsString += `\n\n${formattingTokens.italicToken}[${this.translate('caption.interactiveVersionWithFullStats', options.language)}](${sharableUrl})${formattingTokens.italicToken}`
      }

      // Main weapon stats
      const statsAsString = this.getStatsAsString(buildSummary, options)

      if (statsAsString !== '') {
        buildAsString += `\n\n${statsAsString}`
      }

      // Inventory slots
      let inventorySlotsAsString = ''

      for (const inventorySlot of build.inventorySlots) {
        const inventorySlotAsString = await inventorySlotPropertiesService.toTextAsync(inventorySlot, options)

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

      if (options.type === BuildsToTextType.simpleText && sharableUrl != null) {
        // Build link
        buildAsString += `\n\n${this.translate('caption.interactiveVersionWithFullStats', options.language)}
${sharableUrl}`
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

      let merchantsAsString = `${formattingTokens.italicToken}${this.translate('caption.gameMode', options.language)}${formattingTokens.italicToken} : ${formattingTokens.boldToken}${this.translate(`caption.gameMode_${options.gameMode}`, options.language)}${formattingTokens.boldToken}`
      merchantsAsString += `\n\n${formattingTokens.italicToken}${this.translate('caption.configuredMerchants', options.language)}${formattingTokens.italicToken}`

      for (let i = 0; i < merchantFilters.length; i++) {
        if (i % 3 === 0) {
          merchantsAsString += `${formattingTokens.lineEnd}\n`
        } else {
          merchantsAsString += '   '
        }

        merchantsAsString += `${this.translate('caption.merchant_' + merchantFilters[i].merchant, options.language)} ${this.getTextMerchantLevel(options, options.language, merchantFilters[i].enabled, merchantFilters[i].merchantLevel)}`
      }

      buildsAsString += `\n\n\n\n${merchantsAsString}${formattingTokens.lineEnd}`
    }

    // Totov builder link
    buildsAsString += '\n\n'

    if (options.type === BuildsToTextType.markdown) {
      buildsAsString += `${formattingTokens.italicToken}${this.translate('caption.createdWith', options.language)} [${this.translate('caption.totovBuilder', options.language)}](${window.location.origin})${formattingTokens.italicToken}`
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
    const armorSlotSummary = inventorySlotSummaries.find(iss => iss.type.id === InventorySlotTypeId.bodyArmor)

    if (armorSlotSummary != null && armorSlotSummary.armorModifiers.armorClass !== 0) {
      return armorSlotSummary.armorModifiers
    }

    const vestSlot = inventorySlotSummaries.find(iss => iss.type.id === InventorySlotTypeId.tacticalRig)

    return vestSlot?.armorModifiers ?? {
      armorClass: 0,
      durability: 0
    }
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
   * Gets formatting tokens for text generated from a build.
   * @param options - Options.
   * @returns Formatting tokens.
   */
  private getFormattingTokens(options: IBuildsToTextOptions): { boldToken: string, italicToken: string, lineEnd: string } {
    return {
      boldToken: options.type === BuildsToTextType.markdown ? '**' : '',
      italicToken: options.type === BuildsToTextType.markdown ? '*' : '',
      lineEnd: options.type === BuildsToTextType.markdown ? '  ' : ''
    }
  }

  /**
   * Gets the summary of the main ranged weapon slot of a build.
   * @param inventoryItemSummaries - Inventory slot summaries.
   * @returns Main ranged weapon inventory slot summary.
   */
  private getMainRangedWeaponSummary(inventoryItemSummaries: IInventorySlotSummary[]): IInventorySlotSummary | undefined {
    let mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === InventorySlotTypeId.onSling)

    if (mainRangedWeaponSummary != null && mainRangedWeaponSummary.recoil.verticalRecoil > 0) {
      return mainRangedWeaponSummary
    }

    mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === InventorySlotTypeId.onBack)

    if (mainRangedWeaponSummary != null && mainRangedWeaponSummary.recoil.verticalRecoil > 0) {
      return mainRangedWeaponSummary
    }

    mainRangedWeaponSummary = inventoryItemSummaries.find(iss => iss.type.id === InventorySlotTypeId.holster)

    return mainRangedWeaponSummary
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
  private async getShoppingListAsync(build: IBuild): Promise<IShoppingListItem[]> {
    const inventoryItemService = Services.get(InventoryItemService)
    const shoppingList: IShoppingListItem[] = []

    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotType = Services.get(InventorySlotPropertiesService).getType(inventorySlot.typeId)

      for (const item of inventorySlot.items) {
        if (item == null) {
          continue
        }

        const inventoryItemShoppingList = await inventoryItemService.getShoppingListAsync(item, inventorySlotType.canBeLooted, undefined, inventorySlotType.id)

        // Regrouping similar items
        for (const inventoryItemShoppingListItemToAdd of inventoryItemShoppingList) {
          const inventoryItemShoppingListItemIndex = shoppingList.findIndex(sli =>
            sli.item.id === inventoryItemShoppingListItemToAdd.item.id
            && sli.ignorePrice === inventoryItemShoppingListItemToAdd.ignorePrice
            && sli.inventorySlotId == null // Regrouping only items that are not immediatly in an inventory slot
            && inventoryItemShoppingListItemToAdd.inventorySlotId == null) // Regrouping only items that are not immediatly in an inventory slot

          if (inventoryItemShoppingListItemIndex < 0) {
            shoppingList.push(inventoryItemShoppingListItemToAdd)
          } else {
            shoppingList[inventoryItemShoppingListItemIndex].quantity += inventoryItemShoppingListItemToAdd.quantity

            if (shoppingList[inventoryItemShoppingListItemIndex].price != null
              && inventoryItemShoppingListItemToAdd.unitPrice != null) {
              shoppingList[inventoryItemShoppingListItemIndex].price.value += inventoryItemShoppingListItemToAdd.unitPrice.value * inventoryItemShoppingListItemToAdd.quantity
              shoppingList[inventoryItemShoppingListItemIndex].price.valueInMainCurrency += inventoryItemShoppingListItemToAdd.unitPrice.valueInMainCurrency * inventoryItemShoppingListItemToAdd.quantity
            }
          }
        }
      }
    }

    return shoppingList
  }

  /**
   * Gets the merchant level to display in a text representing a build.
   * @param options - Options.
   * @param language - Language.
   * @param enabled - Indicates whether the merchant is enable.
   * @param level - Merchant level.
   * @returns Merchant level.
   */
  private getTextMerchantLevel(options: IBuildsToTextOptions, language: string, enabled: boolean, level: number): string {
    if (enabled) {
      if (level === 0) {
        return options.includeEmojis ? '✅' : this.translate('caption.yes', language)
      }

      switch (level) {
        case 1:
          return options.includeEmojis ? '1️⃣' : '1'
        case 2:
          return options.includeEmojis ? '2️⃣' : '2'
        case 3:
          return options.includeEmojis ? '3️⃣' : '3'
        case 4:
          return options.includeEmojis ? '4️⃣' : '4'
      }
    }

    return options.includeEmojis ? '❌' : this.translate('caption.no', language)
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
