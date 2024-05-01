import { TinyEmitter } from 'tiny-emitter'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IAmmunition } from '../models/item/IAmmunition'
import { IArmor } from '../models/item/IArmor'
import { IArmorMod } from '../models/item/IArmorMod'
import { IMod } from '../models/item/IMod'
import { IPrice } from '../models/item/IPrice'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import { IWearable } from '../models/item/IWearable'
import { IArmorModifiers } from '../models/utils/IArmorModifiers'
import { IErgonomics } from '../models/utils/IErgonomics'
import { IInventoryItemPrice } from '../models/utils/IInventoryItemPrice'
import { IInventoryItemRecoil } from '../models/utils/IInventoryItemRecoil'
import { IInventoryItemWearableModifiers } from '../models/utils/IInventoryItemWearableModifiers'
import { IRecoilPercentageModifier } from '../models/utils/IRecoilPercentageModifier'
import { IWeight } from '../models/utils/IWeight'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import vueI18n from '../plugins/vueI18n'
import { PriceUtils } from '../utils/PriceUtils'
import Result from '../utils/Result'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import { GlobalFilterService } from './GlobalFilterService'
import { ItemPropertiesService } from './ItemPropertiesService'
import { ItemService } from './ItemService'
import { PresetService } from './PresetService'
import Services from './repository/Services'

/**
 * Represents a service responsible for managing inventory items.
 */
export class InventoryItemService {
  /**
   * Item change event.
   */
  public static inventoryItemChangeEvent = 'inventoryItemChanged'

  /**
   * Event emitter used to signal compatibility check requests.
   */
  public emitter = new TinyEmitter()

  /**
   * Gets the armor class of an inventory item.
   * When the inventory item has a front plate slot, it return the armor class and durability of the contained armor plate.
   * Other whise it returns the armor class and durability of the armor or vest.
   * @param inventoryItem - Inventory item.
   * @returns Front plate armor class.
   */
  public async getArmorModifiers(inventoryItem: IInventoryItem): Promise<Result<IArmorModifiers>> {
    const itemService = Services.get(ItemService)
    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    const itemPropertiesService = Services.get(ItemPropertiesService)

    if (!itemPropertiesService.isArmor(itemResult.value)
      && !itemPropertiesService.isHeadwear(itemResult.value)
      && !itemPropertiesService.isVest(itemResult.value)) {
      return Result.ok({
        armorClass: 0,
        durability: 0
      })
    }

    const frontPlateModSlot = inventoryItem.modSlots.find(m => m.modSlotName === 'front_plate')

    if (frontPlateModSlot != null) {
      if (frontPlateModSlot.item == null) {
        return Result.ok({
          armorClass: 0,
          durability: 0
        })
      }

      const frontPlateResult = await itemService.getItem(frontPlateModSlot.item.itemId)

      if (!frontPlateResult.success) {
        return Result.failFrom(frontPlateResult)
      }

      const frontPlate = frontPlateResult.value as IArmorMod

      return Result.ok({
        armorClass: frontPlate.armorClass,
        durability: frontPlate.durability
      })
    }

    const armor = itemResult.value as IArmor

    return Result.ok({
      armorClass: armor.armorClass,
      durability: armor.durability
    })
  }

  /**
   * Converts an inventory item to a text.
   * @param inventorySlot - Inventory item to convert.
   * @param language - Language.
   * @param itemInSameSlotInPreset - Preset item that is place in the same slot of a preset. If not null, this means that inventoryItem has been placed in the content or mods of a parent item that is a preset. When inventoryItem and itemInSameSlotInPreset are the same, this means that the price of inventoryItem must be ignored because its part of a preset.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   */
  public async getAsString(inventoryItem: IInventoryItem, language: string, itemInSameSlotInPreset?: IInventoryItem, indentationLevel = 0, canBeLooted = true): Promise<string> {
    const itemService = Services.get(ItemService)

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return ''
    }

    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return ''
    }

    const indentationPattern = '    '
    const separator = `${indentationPattern}|${indentationPattern}`
    let inventoryItemAsString = ''

    if (inventoryItem.itemId !== itemInSameSlotInPreset?.itemId) {
      const itemCountAsString = inventoryItem.quantity > 1 ? `${inventoryItem.quantity} x ` : ''
      inventoryItemAsString += `${itemCountAsString}${itemResult.value.name}`
    }

    if (canBeLooted && !inventoryItem.ignorePrice && inventoryItem.itemId !== itemInSameSlotInPreset?.itemId) {
      const priceResult = await this.getPrice(inventoryItem, itemInSameSlotInPreset, canBeLooted)

      if (priceResult.success && priceResult.value.unitPriceIgnoreStatus !== IgnoredUnitPrice.inPreset) {
        if (priceResult.value.missingPrice && priceResult.value.unitPrice.valueInMainCurrency === 0) {
          // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
          inventoryItemAsString += `${separator}${vueI18n.t('message.noMerchant', 1, { locale: language })}`
        } else {
          // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
          inventoryItemAsString += `${separator}${vueI18n.t('caption.merchant_' + priceResult.value.unitPrice.merchant, 1, { locale: language })}`

          if (priceResult.value.unitPrice.merchant !== 'flea-market') {
            inventoryItemAsString += ` ${priceResult.value.unitPrice.merchantLevel}`
          }

          if (priceResult.value.unitPrice.currencyName === 'barter') {
            // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
            inventoryItemAsString += ` (${vueI18n.t('caption.barter', 1, { locale: language }).toLocaleLowerCase()}): ${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceResult.value.price.valueInMainCurrency, language)}${mainCurrencyResult.value.symbol}`
          } else {
            inventoryItemAsString += `: ${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceResult.value.price.value, language)}`

            if (priceResult.value.price.currencyName === mainCurrencyResult.value.name) {
              inventoryItemAsString += mainCurrencyResult.value.symbol
            } else {
              const priceCurrencyResult = await itemService.getCurrency(priceResult.value.price.currencyName)

              if (priceCurrencyResult.success) {
                inventoryItemAsString += `${priceCurrencyResult.value.symbol} (= ${StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceResult.value.price.valueInMainCurrency, language)}${mainCurrencyResult.value.symbol})`
              }
            }
          }
        }
      }
    }

    if (inventoryItem.content.length > 0 || inventoryItem.modSlots.length > 0) {
      let preset = itemInSameSlotInPreset

      if (preset == null) {
        preset = Services.get(PresetService).getPreset(inventoryItem.itemId)
      }

      indentationLevel++
      let indentation = ''

      for (let i = 1; i <= indentationLevel; i++) {
        indentation += indentationPattern
      }

      // Mods
      for (const modSlot of inventoryItem.modSlots) {
        if (modSlot.item == null) {
          continue
        }

        const modSlotInPreset = preset?.modSlots.find(ms => ms.modSlotName === modSlot.modSlotName)
        const modSlotItemAsString = await this.getAsString(modSlot.item, language, modSlotInPreset?.item, indentationLevel)

        if (modSlotItemAsString !== '') {
          // @ts-expect-error For some reason, this signature of vueI18n.t() is not recognized while it really exists
          const modSlotName = vueI18n.t('caption.modSlot_' + modSlot.modSlotName, 1, { locale: language })
          inventoryItemAsString += `
${indentation}[${modSlotName}] ${modSlotItemAsString}`
        }
      }

      // Content
      for (let i = 0; i < inventoryItem.content.length; i++) {
        const containedItem = inventoryItem.content[i]
        const containedItemInPreset = preset?.content[i]
        const containedItemAsString = await this.getAsString(containedItem, language, containedItemInPreset, indentationLevel)

        if (containedItemAsString !== '') {
          inventoryItemAsString += `
${indentation}${containedItemAsString}`
        }
      }
    }

    return inventoryItemAsString
  }

  /**
   * Gets the ergonomics of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Ergonomics.
   */
  public async getErgonomics(inventoryItem: IInventoryItem): Promise<Result<IErgonomics>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    const itemPropertiesService = Services.get(ItemPropertiesService)
    let ergonomics = 0

    if (itemPropertiesService.isRangedWeapon(itemResult.value)) {
      ergonomics = (itemResult.value as IRangedWeapon).ergonomics
    } else if (itemPropertiesService.isModdable(itemResult.value)) {
      ergonomics = (itemResult.value as IMod).ergonomicsModifier
    }

    let ergonomicsWithMods = ergonomics

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modErgonomicsResult = await this.getErgonomics(modSlot.item)

      if (!modErgonomicsResult.success) {
        return Result.failFrom(modErgonomicsResult)
      }

      ergonomicsWithMods += modErgonomicsResult.value.ergonomicsWithMods
    }

    return Result.ok({
      ergonomics: ergonomics,
      ergonomicsWithMods: ergonomicsWithMods
    })
  }

  /**
   * Gets the price of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @param itemInSameSlotInPreset - Preset item that is place in the same slot of a preset. If not null, this means that inventoryItem has been placed in the content or mods of a parent item that is a preset. When inventoryItem and itemInSameSlotInPreset are the same, this means that the price of inventoryItem must be ignored because its part of a preset.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @param useMerchantFilter - Indicates whether the merchant filter is used. If false, all prices are taken into consideration. Used mainly to ignore merchant filter to be able to display all the prices and barters of an item in its stats.
   * @returns Price.
   */
  public async getPrice(inventoryItem: IInventoryItem, itemInSameSlotInPreset?: IInventoryItem, canBeLooted = true, useMerchantFilter = true): Promise<Result<IInventoryItemPrice>> {
    const globalFilterService = Services.get(GlobalFilterService)
    const itemService = Services.get(ItemService)
    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    let unitPrice: IPrice = {
      barterItems: [],
      currencyName: 'RUB',
      itemId: '',
      merchant: '',
      merchantLevel: 0,
      quest: undefined,
      value: 0,
      valueInMainCurrency: 0
    }
    let barterItemPrices: IInventoryItemPrice[] = []
    let unitPriceIgnoreStatus = IgnoredUnitPrice.notIgnored

    if (!canBeLooted) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.notLootable
    } else if (itemInSameSlotInPreset?.itemId === inventoryItem.itemId) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (itemInSameSlotInPreset?.content.some(c => c.itemId === inventoryItem.itemId && c.quantity === inventoryItem.quantity)) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (inventoryItem.ignorePrice) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.manuallyIgnored
    }

    let hasUnitPrice = false

    if (unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored) {
      const matchingPrices = useMerchantFilter ? globalFilterService.getMatchingPrices(itemResult.value) : itemResult.value.prices

      for (const matchingPrice of matchingPrices) {
        let missingBarterItemPrice = false
        let matchingPriceInMainCurrency = matchingPrice.valueInMainCurrency
        const matchingPriceBarterItemPrices: IInventoryItemPrice[] = []

        if (matchingPrice.currencyName === 'barter') {
          for (const barterItem of matchingPrice.barterItems) {
            const barterItemPriceResult = await this.getPrice({
              content: [],
              ignorePrice: false,
              itemId: barterItem.itemId,
              modSlots: [],
              quantity: barterItem.quantity
            }, undefined, true, useMerchantFilter)

            if (!barterItemPriceResult.success) {
              return Result.failFrom(barterItemPriceResult)
            }

            if (barterItemPriceResult.value.missingPrice) {
              missingBarterItemPrice = true
              continue
            }

            matchingPriceBarterItemPrices.push(barterItemPriceResult.value)
            matchingPriceInMainCurrency += barterItemPriceResult.value.price.valueInMainCurrency
          }
        }

        if (!missingBarterItemPrice
          && (unitPrice.valueInMainCurrency === 0
            || matchingPriceInMainCurrency < unitPrice.valueInMainCurrency)) {
          hasUnitPrice = true
          unitPrice = {
            // Creating a new instance because we need to set the valueInMainCurrency.
            // If we directly use a reference to matchinPrice.valueInMainCurrency, then we modify this price for the whole application each time we pass here
            ...matchingPrice,
            valueInMainCurrency: matchingPriceInMainCurrency
          }
          barterItemPrices = matchingPriceBarterItemPrices
        }
      }

      // If no unit price is found but it exists barters with missing barter item prices, we arbitrarily select the first one as the unit price
      // in order for the user to be able to see the merchant and the barter items where the price will be displayed
      const barterMatchingPrices = matchingPrices.filter(mp => mp.currencyName === 'barter')

      if (unitPrice.merchant === '' && barterMatchingPrices.length > 0) {
        unitPrice = {
          ...barterMatchingPrices[0]
        }
      }
    }

    const price: IPrice = {
      barterItems: [],
      currencyName: unitPrice.currencyName,
      itemId: unitPrice.itemId,
      merchant: unitPrice.merchant,
      merchantLevel: unitPrice.merchantLevel,
      quest: unitPrice.quest,
      value: unitPrice.value * inventoryItem.quantity,
      valueInMainCurrency: unitPrice.valueInMainCurrency * inventoryItem.quantity
    }

    for (const barterItem of unitPrice.barterItems) {
      price.barterItems.push({
        itemId: barterItem.itemId,
        quantity: barterItem.quantity * inventoryItem.quantity
      })
    }

    const mainCurrencyResult = await itemService.getMainCurrency()

    if (!mainCurrencyResult.success) {
      return Result.failFrom(mainCurrencyResult)
    }

    const inventoryPrice: IInventoryItemPrice = {
      missingPrice: unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored && !hasUnitPrice,
      price,
      pricesWithContent: [],
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: price.valueInMainCurrency,
        valueInMainCurrency: price.valueInMainCurrency
      },
      unitPrice,
      unitPriceIgnoreStatus
    }

    if (price.valueInMainCurrency > 0) {
      if (price.currencyName !== 'barter') {
        inventoryPrice.pricesWithContent.push({
          barterItems: [],
          currencyName: price.currencyName,
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: price.value,
          valueInMainCurrency: price.valueInMainCurrency
        })
      } else {
        // Adding barter item prices
        for (const barterItemPrice of barterItemPrices) {
          for (const barterItemPriceWithContent of barterItemPrice.pricesWithContent) {
            const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === barterItemPriceWithContent.currencyName)

            if (currencyIndex < 0) {
              inventoryPrice.pricesWithContent.push({
                barterItems: [],
                currencyName: barterItemPriceWithContent.currencyName,
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: barterItemPriceWithContent.value * inventoryItem.quantity,
                valueInMainCurrency: barterItemPriceWithContent.valueInMainCurrency * inventoryItem.quantity
              })
            } else {
              inventoryPrice.pricesWithContent[currencyIndex].value += barterItemPriceWithContent.value * inventoryItem.quantity
              inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += barterItemPriceWithContent.valueInMainCurrency * inventoryItem.quantity
            }
          }
        }
      }
    }

    let preset = itemInSameSlotInPreset

    if (preset == null) {
      preset = Services.get(PresetService).getPreset(inventoryItem.itemId)
    }

    // Adding content prices
    for (let i = 0; i < inventoryItem.content.length; i++) {
      const containedItem = inventoryItem.content[i]

      /* c8 ignore start */
      if (containedItem == null) {
        // !!! WORKAROUNG !!! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }
      /* c8 ignore stop */

      const containedItemPriceResult = await this.getPrice(containedItem, preset?.content[i])

      if (!containedItemPriceResult.success) {
        return Result.failFrom(containedItemPriceResult)
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

    // Adding mod prices
    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const presetModSlot = preset?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const modPriceResult = await this.getPrice(modSlot.item, presetModSlot?.item)

      if (!modPriceResult.success) {
        return Result.failFrom(modPriceResult)
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

    if (inventoryPrice.pricesWithContent.length > 1) {
      inventoryPrice.pricesWithContent = PriceUtils.sortByCurrency(inventoryPrice.pricesWithContent)
    }

    return Result.ok(inventoryPrice)
  }

  /**
   * Gets the recoil of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Recoil.
   */
  public async getRecoil(inventoryItem: IInventoryItem): Promise<Result<IInventoryItemRecoil>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    if (!Services.get(ItemPropertiesService).isRangedWeapon(itemResult.value)) {
      return Result.ok({
        horizontalRecoil: 0,
        horizontalRecoilWithMods: 0,
        verticalRecoil: 0,
        verticalRecoilWithMods: 0
      })
    }

    const rangedWeapon = itemResult.value as IRangedWeapon
    const recoil: IInventoryItemRecoil = {
      horizontalRecoil: rangedWeapon.horizontalRecoil,
      horizontalRecoilWithMods: rangedWeapon.horizontalRecoil,
      verticalRecoil: rangedWeapon.verticalRecoil,
      verticalRecoilWithMods: rangedWeapon.verticalRecoil
    }

    // Getting the chambered or in magazine ammunition recoil percentage modifier
    const chamberedAmmunitionRecoilPercentageModifierResult = await this.getChamberedAmmunitionRecoilPercentageModifier(inventoryItem.modSlots)

    if (!chamberedAmmunitionRecoilPercentageModifierResult.success) {
      return Result.failFrom(chamberedAmmunitionRecoilPercentageModifierResult)
    }

    // TODO : Display the ammunition modifier next to the weapon recoil instead of including it in the calculation
    const chamberedAmmunitionRecoilPercentageModifier = 0/*chamberedAmmunitionRecoilPercentageModifierResult.value*/

    // Getting the recoil percentage modifier for each mods
    let modsRecoilPercentageModifiers = 0

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modRecoilPercentageModifierResult = await this.getRecoilPercentageModifier(modSlot.item)

      if (!modRecoilPercentageModifierResult.success) {
        return Result.failFrom(modRecoilPercentageModifierResult)
      }

      modsRecoilPercentageModifiers += modRecoilPercentageModifierResult.value.recoilPercentageModifierWithMods
    }

    // Applying to the weapon recoil the recoil percentage modifiers of its mods
    recoil.horizontalRecoilWithMods = recoil.horizontalRecoil + (recoil.horizontalRecoil * modsRecoilPercentageModifiers)
    recoil.horizontalRecoilWithMods = recoil.horizontalRecoilWithMods * (1 + chamberedAmmunitionRecoilPercentageModifier)
    recoil.verticalRecoilWithMods = recoil.verticalRecoil + (recoil.verticalRecoil * modsRecoilPercentageModifiers)
    recoil.verticalRecoilWithMods = recoil.verticalRecoilWithMods * (1 + chamberedAmmunitionRecoilPercentageModifier)

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
      return Result.failFrom(itemResult)
    }

    const itemPropertiesService = Services.get(ItemPropertiesService)
    const recoilPercentageModifier: IRecoilPercentageModifier = {
      recoilPercentageModifier: 0,
      recoilPercentageModifierWithMods: 0
    }

    if (!itemPropertiesService.isModdable(itemResult.value)) {
      return Result.ok(recoilPercentageModifier)
    }

    const rangedWeaponMod = itemResult.value as IRangedWeaponMod

    if (itemPropertiesService.isRangedWeaponMod(itemResult.value)) {
      recoilPercentageModifier.recoilPercentageModifier = rangedWeaponMod.recoilPercentageModifier
      recoilPercentageModifier.recoilPercentageModifierWithMods = rangedWeaponMod.recoilPercentageModifier
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modRecoilPercentageModifierResult = await this.getRecoilPercentageModifier(modSlot.item)

      if (!modRecoilPercentageModifierResult.success) {
        return Result.failFrom(modRecoilPercentageModifierResult)
      }

      recoilPercentageModifier.recoilPercentageModifierWithMods = recoilPercentageModifier.recoilPercentageModifierWithMods + modRecoilPercentageModifierResult.value.recoilPercentageModifierWithMods
    }

    return Result.ok(recoilPercentageModifier)
  }

  /**
   * Gets a shopping list for this item and all its content, mod and barter items that must be bought.
   * @param inventoryItem - Inventory item.
   * @param presetModSlotItem - Preset mod slot item used to ignore the price of mods that are installed by default on an item.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @returns Shopping list items.
   */
  public async getShoppingList(inventoryItem: IInventoryItem, presetModSlotItem?: IInventoryItem, canBeLooted = true): Promise<Result<IShoppingListItem[]>> {
    const itemService = Services.get(ItemService)
    const shoppingList: IShoppingListItem[] = []
    const shoppingListItemsToAdd: IShoppingListItem[] = []

    const itemResult = await itemService.getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
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
      const priceResult = await this.getPrice(inventoryItem)

      if (!priceResult.success) {
        return Result.failFrom(priceResult)
      }

      let unitPrice: IPrice

      // Barters
      const shoppingListBartersToAdd: IShoppingListItem[] = []

      if (priceResult.value.unitPrice.currencyName === 'barter') {
        for (const barterItem of priceResult.value.unitPrice.barterItems) {
          const barterItemShoppingListResult = await this.getShoppingList({
            content: [],
            ignorePrice: false,
            itemId: barterItem.itemId,
            modSlots: [],
            quantity: barterItem.quantity * inventoryItem.quantity
          })

          /* c8 ignore start */
          if (!barterItemShoppingListResult.success) {
            // Should never happen since barter item prices are already searched in the getPrice() method
            return Result.failFrom(barterItemShoppingListResult)
          }
          /* c8 ignore stop */

          shoppingListBartersToAdd.push(...barterItemShoppingListResult.value)
        }

        // Setting the unit price of items that have barter items to 0 since barter items and their price are added to the shopping list
        unitPrice = {
          barterItems: [],
          currencyName: 'barter',
          itemId: inventoryItem.itemId,
          merchant: priceResult.value.unitPrice.merchant,
          merchantLevel: priceResult.value.unitPrice.merchantLevel,
          quest: priceResult.value.unitPrice.quest,
          value: 0,
          valueInMainCurrency: 0
        }
      } else {
        unitPrice = priceResult.value.unitPrice
      }

      shoppingListItemsToAdd.push({
        item: itemResult.value,
        quantity: inventoryItem.quantity,
        price: {
          barterItems: unitPrice.barterItems,
          currencyName: unitPrice.currencyName,
          itemId: unitPrice.itemId,
          merchant: unitPrice.merchant,
          merchantLevel: unitPrice.merchantLevel,
          quest: unitPrice.quest,
          value: unitPrice.value * inventoryItem.quantity,
          valueInMainCurrency: unitPrice.valueInMainCurrency * inventoryItem.quantity
        },
        unitPrice
      }, ...shoppingListBartersToAdd)
    }

    // Mods
    if (presetModSlotItem == null) {
      presetModSlotItem = Services.get(PresetService).getPreset(inventoryItem.itemId)
    }

    for (const modSlot of inventoryItem.modSlots) {
      /* c8 ignore start */
      if (modSlot.item == null) {
        continue
      }
      /* c8 ignore stop */

      const presetModSlot = presetModSlotItem?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const shoppingListResult = await this.getShoppingList(modSlot.item, presetModSlot?.item)

      /* c8 ignore start */
      if (!shoppingListResult.success) {
        // Should never happen since mod prices are already searched in the getPrice() method
        return Result.failFrom(shoppingListResult)
      }
      /* c8 ignore stop */

      shoppingListItemsToAdd.push(...shoppingListResult.value)
    }

    // Content
    for (const content of inventoryItem.content) {
      const shoppingListResult = await this.getShoppingList(content)

      /* c8 ignore start */
      if (!shoppingListResult.success) {
        // Should never happen since content item prices are already searched in the getPrice() method
        return Result.failFrom(shoppingListResult)
      }
      /* c8 ignore stop */

      shoppingListItemsToAdd.push(...shoppingListResult.value)
    }

    // Regrouping similar items
    for (const shoppingListItemToAdd of shoppingListItemsToAdd) {
      const shoppingListItemIndex = shoppingList.findIndex(sli => sli.item.id === shoppingListItemToAdd.item.id)

      if (shoppingListItemIndex < 0) {
        shoppingList.push(shoppingListItemToAdd)
      } else {
        shoppingList[shoppingListItemIndex].quantity += shoppingListItemToAdd.quantity
        shoppingList[shoppingListItemIndex].price.value += shoppingListItemToAdd.unitPrice.value * shoppingListItemToAdd.quantity
        shoppingList[shoppingListItemIndex].price.valueInMainCurrency += shoppingListItemToAdd.unitPrice.valueInMainCurrency * shoppingListItemToAdd.quantity
      }
    }

    return Result.ok(shoppingList)
  }

  /**
   * Gets the modifiers obtained from a wearable item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Wearable modifiers.
   */
  public async getWearableModifiers(inventoryItem: IInventoryItem): Promise<Result<IInventoryItemWearableModifiers>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    if (!Services.get(ItemPropertiesService).isWearable(itemResult.value)) {
      return Result.ok({
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: 0,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: 0,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: 0
      })
    }

    const wearable = itemResult.value as IWearable
    const ergonomicsPercentageModifier = wearable.ergonomicsPercentageModifier
    let ergonomicsPercentageModifierWithMods = ergonomicsPercentageModifier

    const movementSpeedPercentageModifier = wearable.movementSpeedPercentageModifier
    let movementSpeedPercentageModifierWithMods = movementSpeedPercentageModifier

    const turningSpeedPercentageModifier = wearable.turningSpeedPercentageModifier
    let turningSpeedPercentageModifierWithMods = turningSpeedPercentageModifier

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modWearableModifiersResult = await this.getWearableModifiers(modSlot.item)

      if (!modWearableModifiersResult.success) {
        return Result.failFrom(modWearableModifiersResult)
      }

      ergonomicsPercentageModifierWithMods += modWearableModifiersResult.value.ergonomicsPercentageModifierWithMods
      movementSpeedPercentageModifierWithMods += modWearableModifiersResult.value.movementSpeedPercentageModifierWithMods
      turningSpeedPercentageModifierWithMods += modWearableModifiersResult.value.turningSpeedPercentageModifierWithMods
    }

    return Result.ok({
      ergonomicsPercentageModifier,
      ergonomicsPercentageModifierWithMods,
      movementSpeedPercentageModifier,
      movementSpeedPercentageModifierWithMods,
      turningSpeedPercentageModifier,
      turningSpeedPercentageModifierWithMods
    })
  }

  /**
   * Gets the weight of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Weight.
   */
  public async getWeight(inventoryItem: IInventoryItem): Promise<Result<IWeight>> {
    const itemResult = await Services.get(ItemService).getItem(inventoryItem.itemId)

    if (!itemResult.success) {
      return Result.failFrom(itemResult)
    }

    const weight = itemResult.value.weight * inventoryItem.quantity
    let weightWithContent = weight

    for (const containedItem of inventoryItem.content) {
      /* c8 ignore start */
      if (containedItem == null) {
        // !!! WORKAROUNG !!! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }
      /* c8 ignore stop */

      const containedItemWeightResult = await this.getWeight(containedItem)

      if (!containedItemWeightResult.success) {
        return Result.failFrom(containedItemWeightResult)
      }

      weightWithContent += containedItemWeightResult.value.weightWithContent
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modWeightResult = await this.getWeight(modSlot.item)

      if (!modWeightResult.success) {
        return Result.failFrom(modWeightResult)
      }

      weightWithContent += modWeightResult.value.weightWithContent
    }

    return Result.ok({
      weight: weight,
      weightWithContent: weightWithContent,
      unitWeight: itemResult.value.weight
    })
  }

  /**
   * Gets the recoil percentage modifier of the chambered ammunition (or contained in the magazine when not having a chamber)
   * of a ranged weapon.
   * @param modSlots - Mod slots.
   * @returns Recoil percentage modifier.
   */
  private async getChamberedAmmunitionRecoilPercentageModifier(modSlots: IInventoryModSlot[]): Promise<Result<number>> {
    let ammunitionId: string | undefined

    for (const modSlot of modSlots) {
      if (modSlot.modSlotName.startsWith('chamber') && modSlot.item != null) {
        ammunitionId = modSlot.item.itemId

        break
      } else if (modSlot.modSlotName === 'mod_magazine' && modSlot.item != null) {
        if (modSlot.item.content.length === 0 && modSlot.item.modSlots.length > 0) {
          // The magazine is composed of multiple slots that each receive a cartridge (revolver cylinder magazine)
          ammunitionId = modSlot.item.modSlots.filter(ms => ms.item != null)[0]?.item?.itemId
        } else {
          // Normal magazine
          ammunitionId = modSlot.item.content[0]?.itemId
        }

        break
      }
    }

    if (ammunitionId == null) {
      return Result.ok(0)
    }

    const ammunitionResult = await Services.get(ItemService).getItem(ammunitionId)

    if (!ammunitionResult.success) {
      return Result.failFrom(ammunitionResult)
    }

    return Result.ok((ammunitionResult.value as IAmmunition).recoilPercentageModifier)
  }
}
