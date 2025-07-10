/* eslint-disable no-irregular-whitespace */ // Special character used to force markdown to take into account spaces
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
import { BuildsToTextType, IBuildsToTextOptions } from '../models/utils/IBuildsToTextOptions'
import { IErgonomics } from '../models/utils/IErgonomics'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { IInventoryItemPrice } from '../models/utils/IInventoryItemPrice'
import { IInventoryItemRecoil } from '../models/utils/IInventoryItemRecoil'
import { IRecoilModifierPercentage } from '../models/utils/IRecoilModifierPercentage'
import { IWearableModifiers } from '../models/utils/IWearableModifiers'
import { IWeight } from '../models/utils/IWeight'
import vueI18n from '../plugins/vueI18n'
import { PriceUtils } from '../utils/PriceUtils'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import StringUtils from '../utils/StringUtils'
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
   * Gets the armor class of an inventory item.
   * When the inventory item has a front plate slot, it return the armor class of the contained armor plate.
   * Otherwise it returns the armor class of the armor or vest.
   * When the inventory item has armor plates, it returns the sum of the item and armor plates durability.
   * @param inventoryItem - Inventory item.
   * @returns Armor modifiers.
   */
  public async getArmorModifiersAsync(inventoryItem: IInventoryItem): Promise<IArmorModifiers> {
    const itemService = Services.get(ItemService)
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const item = await itemService.getItemAsync(inventoryItem.itemId)

    if (!itemPropertiesService.canHaveArmor(item)) {
      return {
        armorClass: 0,
        durability: 0
      }
    }

    const armor = item as IArmor
    let armorClass = armor.armorClass
    let durability = armor.durability
    const armorPlateModSlots = inventoryItem.modSlots.filter(m => m.modSlotName.endsWith('_plate'))

    for (const armorPlateModSlot of armorPlateModSlots) {
      if (armorPlateModSlot.item == null) {
        continue
      }

      const armorPlate = await itemService.getItemAsync(armorPlateModSlot.item.itemId) as IArmorMod
      const isArmorMod = itemPropertiesService.isArmorMod(armorPlate)

      if (!isArmorMod) {
        continue
      }

      if (armorPlateModSlot.modSlotName === 'front_plate') {
        armorClass = armorPlate.armorClass
      }

      durability += armorPlate.durability
    }

    return {
      armorClass,
      durability
    }
  }

  /**
   * Gets the ergonomics of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Ergonomics.
   */
  public async getErgonomicsAsync(inventoryItem: IInventoryItem): Promise<IErgonomics> {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    let ergonomics = 0
    const item = await Services.get(ItemService).getItemAsync(inventoryItem.itemId)

    if (itemPropertiesService.isRangedWeapon(item)) {
      ergonomics = (item as IRangedWeapon).ergonomics
    } else if (itemPropertiesService.isModdable(item)) {
      ergonomics = (item as IMod).ergonomicsModifier
    }

    let ergonomicsWithMods = ergonomics

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modErgonomics = await this.getErgonomicsAsync(modSlot.item)

      if (modErgonomics != null) {
        ergonomicsWithMods += modErgonomics.ergonomicsWithMods
      }
    }

    return {
      ergonomics: ergonomics,
      ergonomicsWithMods: ergonomicsWithMods
    }
  }

  /**
   * Gets the price of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @param itemInSameSlotInPreset - Preset item that is place in the same slot of a preset. If not null, this means that inventoryItem has been placed in the content or mods of a parent item that is a preset. When inventoryItem and itemInSameSlotInPreset are the same, this means that the price of inventoryItem must be ignored because its part of a preset.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @param useMerchantFilter - Indicates whether the merchant filter is used. If false, all prices are taken into consideration. Used mainly to ignore merchant filter to be able to display all the prices and barters of an item in its stats.
   * @returns Price.
   */
  public async getPriceAsync(inventoryItem: IInventoryItem, itemInSameSlotInPreset?: IInventoryItem, canBeLooted = true, useMerchantFilter = true): Promise<IInventoryItemPrice> {
    const globalFilterService = Services.get(GlobalFilterService)
    const itemService = Services.get(ItemService)

    const item = await itemService.getItemAsync(inventoryItem.itemId)
    const mainCurrency = itemService.getMainCurrency()

    let unitPrice: IPrice = {
      barterItems: [],
      currencyName: mainCurrency.name,
      itemId: item.id,
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
    } else if (itemInSameSlotInPreset?.itemId === inventoryItem.itemId && itemInSameSlotInPreset?.quantity === inventoryItem.quantity) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (inventoryItem.ignorePrice) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.manuallyIgnored
    }

    let hasUnitPrice = false

    if (unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored) {
      const matchingPrices = useMerchantFilter ? globalFilterService.getMatchingPrices(item) : item.prices

      for (const matchingPrice of matchingPrices) {
        let missingBarterItemPrice = false
        let matchingPriceInMainCurrency = matchingPrice.valueInMainCurrency
        const matchingPriceBarterItemPrices: IInventoryItemPrice[] = []

        if (matchingPrice.currencyName === 'barter') {
          for (const barterItem of matchingPrice.barterItems) {
            const barterItemPrice = await this.getPriceAsync(
              {
                content: [],
                ignorePrice: false,
                itemId: barterItem.itemId,
                modSlots: [],
                quantity: barterItem.quantity
              },
              undefined,
              true,
              useMerchantFilter)

            if (barterItemPrice.missingPrice) {
              missingBarterItemPrice = true
              continue
            }

            matchingPriceBarterItemPrices.push(barterItemPrice)
            matchingPriceInMainCurrency += barterItemPrice.price.valueInMainCurrency
          }
        }

        if (!missingBarterItemPrice
          && (unitPrice.valueInMainCurrency === 0
            || matchingPriceInMainCurrency < unitPrice.valueInMainCurrency)) {
          hasUnitPrice = true
          unitPrice = {
            // Creating a new instance because we need to set the valueInMainCurrency.
            // If we directly use a reference to matchingPrice.valueInMainCurrency, then we modify this price for the whole application each time we pass here
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

    const inventoryPrice: IInventoryItemPrice = {
      missingPrice: unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored && !hasUnitPrice,
      price,
      pricesWithContent: [],
      priceWithContentInMainCurrency: price.valueInMainCurrency,
      unitPrice,
      unitPriceIgnoreStatus
    }

    if (price.value > 0) {
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

      const containedItemPrice = await this.getPriceAsync(containedItem, preset?.content[i])

      for (const containedItemPriceWithContent of containedItemPrice.pricesWithContent) {
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === containedItemPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(containedItemPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += containedItemPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += containedItemPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency += containedItemPriceWithContent.valueInMainCurrency
      }

      if (containedItemPrice.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    // Adding mod prices
    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const presetModSlot = preset?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const modPrice = await this.getPriceAsync(modSlot.item, presetModSlot?.item)

      for (const modPriceWithContent of modPrice.pricesWithContent) {
        const currencyIndex = inventoryPrice.pricesWithContent.findIndex(p => p.currencyName === modPriceWithContent.currencyName)

        if (currencyIndex < 0) {
          inventoryPrice.pricesWithContent.push(modPriceWithContent)
        } else {
          inventoryPrice.pricesWithContent[currencyIndex].value += modPriceWithContent.value
          inventoryPrice.pricesWithContent[currencyIndex].valueInMainCurrency += modPriceWithContent.valueInMainCurrency
        }

        inventoryPrice.priceWithContentInMainCurrency += modPriceWithContent.valueInMainCurrency
      }

      if (modPrice.missingPrice) {
        inventoryPrice.missingPrice = true
      }
    }

    if (inventoryPrice.pricesWithContent.length > 1) {
      inventoryPrice.pricesWithContent = PriceUtils.sortByCurrency(inventoryPrice.pricesWithContent)
    }

    return inventoryPrice
  }

  /**
   * Gets the recoil of an item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Recoil.
   */
  public async getRecoilAsync(inventoryItem: IInventoryItem): Promise<IInventoryItemRecoil> {
    const item = await Services.get(ItemService).getItemAsync(inventoryItem.itemId)

    if (!Services.get(ItemPropertiesService).isRangedWeapon(item)) {
      return {
        horizontalRecoil: 0,
        horizontalRecoilWithMods: 0,
        verticalRecoil: 0,
        verticalRecoilWithMods: 0
      }
    }

    const rangedWeapon = item as IRangedWeapon
    const recoil: IInventoryItemRecoil = {
      horizontalRecoil: rangedWeapon.horizontalRecoil,
      horizontalRecoilWithMods: rangedWeapon.horizontalRecoil,
      verticalRecoil: rangedWeapon.verticalRecoil,
      verticalRecoilWithMods: rangedWeapon.verticalRecoil
    }

    // Getting the chambered or in magazine ammunition recoil modifier
    const chamberedAmmunitionRecoilModifier = await this.getChamberedAmmunitionRecoilModifierAsync(inventoryItem.modSlots) ?? 0

    // Applying the chambered ammunition recoil modifier
    recoil.horizontalRecoilWithMods += chamberedAmmunitionRecoilModifier
    recoil.verticalRecoilWithMods += chamberedAmmunitionRecoilModifier

    // Getting the recoil modifier percentage for each mods
    let modsRecoilModifierPercentages = 0

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modRecoilModifierPercentage = await this.getRecoilModifierPercentageAsync(modSlot.item)
      modsRecoilModifierPercentages += modRecoilModifierPercentage.recoilModifierPercentageWithMods
    }

    // Applying to the weapon recoil the recoil modifier percentages of its mods
    recoil.horizontalRecoilWithMods += recoil.horizontalRecoilWithMods * modsRecoilModifierPercentages
    recoil.verticalRecoilWithMods += recoil.verticalRecoilWithMods * modsRecoilModifierPercentages

    return recoil
  }

  /**
   * Gets the recoil modifier of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Recoil modifier percentage.
   */
  public async getRecoilModifierPercentageAsync(inventoryItem: IInventoryItem): Promise<IRecoilModifierPercentage> {
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const item = await Services.get(ItemService).getItemAsync(inventoryItem.itemId)

    if (!itemPropertiesService.isModdable(item)) {
      return {
        recoilModifierPercentage: 0,
        recoilModifierPercentageWithMods: 0
      }
    }

    const recoilModifierPercentage: IRecoilModifierPercentage = {
      recoilModifierPercentage: 0,
      recoilModifierPercentageWithMods: 0
    }

    const rangedWeaponMod = item as IRangedWeaponMod

    if (itemPropertiesService.isRangedWeaponMod(item)) {
      recoilModifierPercentage.recoilModifierPercentage = rangedWeaponMod.recoilModifierPercentage
      recoilModifierPercentage.recoilModifierPercentageWithMods = rangedWeaponMod.recoilModifierPercentage
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modRecoilModifierPercentage = await this.getRecoilModifierPercentageAsync(modSlot.item)
      recoilModifierPercentage.recoilModifierPercentageWithMods = recoilModifierPercentage.recoilModifierPercentageWithMods + modRecoilModifierPercentage.recoilModifierPercentageWithMods
    }

    return recoilModifierPercentage
  }

  /**
   * Gets a shopping list for this item and all its content, mod and barter items that must be bought.
   * @param inventoryItem - Inventory item.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @param presetModSlotItem - Preset mod slot item used to ignore the price of mods that are installed by default on an item.
   * @param inventorySlotId - Name of the inventory slot in which the item is found.
   * @returns Shopping list items.
   */
  public async getShoppingListAsync(
    inventoryItem: IInventoryItem,
    canBeLooted = true,
    presetModSlotItem: IInventoryItem | undefined = undefined,
    inventorySlotId: string | undefined = undefined): Promise<IShoppingListItem[]> {
    const itemService = Services.get(ItemService)
    const shoppingList: IShoppingListItem[] = []
    const shoppingListItemsToAdd: IShoppingListItem[] = []

    const item = await itemService.getItemAsync(inventoryItem.itemId)
    let unitPriceIgnoreStatus = IgnoredUnitPrice.notIgnored

    if (!canBeLooted) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.notLootable
    } else if (presetModSlotItem?.itemId === inventoryItem.itemId) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (inventoryItem.ignorePrice) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.manuallyIgnored
    }

    if (unitPriceIgnoreStatus === IgnoredUnitPrice.notLootable
      || unitPriceIgnoreStatus === IgnoredUnitPrice.manuallyIgnored
    ) {
      shoppingListItemsToAdd.push({
        ignorePrice: unitPriceIgnoreStatus,
        inventorySlotId: inventorySlotId,
        item,
        missingPrice: false,
        quantity: inventoryItem.quantity
      })
    } else if (unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored) {
      let unitPrice: IPrice
      const price = await this.getPriceAsync(inventoryItem)

      // Barters
      const shoppingListBartersToAdd: IShoppingListItem[] = []

      if (price.unitPrice.currencyName === 'barter') {
        for (const barterItem of price.unitPrice.barterItems) {
          const barterItemShoppingList = await this.getShoppingListAsync({
            content: [],
            ignorePrice: false,
            itemId: barterItem.itemId,
            modSlots: [],
            quantity: barterItem.quantity * inventoryItem.quantity
          })
          shoppingListBartersToAdd.push(...barterItemShoppingList)
        }

        // Setting the unit price of items that have barter items to 0 since barter items and their price are added to the shopping list
        unitPrice = {
          barterItems: price.unitPrice.barterItems,
          currencyName: 'barter',
          itemId: inventoryItem.itemId,
          merchant: price.unitPrice.merchant,
          merchantLevel: price.unitPrice.merchantLevel,
          quest: price.unitPrice.quest,
          value: 0,
          valueInMainCurrency: 0
        }
      } else {
        unitPrice = price.unitPrice
      }

      shoppingListItemsToAdd.push({
        ignorePrice: unitPriceIgnoreStatus,
        inventorySlotId: inventorySlotId,
        item,
        missingPrice: price.missingPrice && price.unitPrice.barterItems.length === 0 && price.unitPrice.valueInMainCurrency === 0,
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
      if (modSlot.item == null) {
        continue
      }

      const presetModSlot = presetModSlotItem?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const modShoppingList = await this.getShoppingListAsync(modSlot.item, true, presetModSlot?.item)
      shoppingListItemsToAdd.push(...modShoppingList)
    }

    // Content
    for (const content of inventoryItem.content) {
      const containedItemShoppingList = await this.getShoppingListAsync(content)
      shoppingListItemsToAdd.push(...containedItemShoppingList)
    }

    // Regrouping similar items
    for (const shoppingListItemToAdd of shoppingListItemsToAdd) {
      const shoppingListItemIndex = shoppingList.findIndex(sli =>
        sli.item.id === shoppingListItemToAdd.item.id
        && sli.ignorePrice === shoppingListItemToAdd.ignorePrice
        && sli.missingPrice === shoppingListItemToAdd.missingPrice)

      if (shoppingListItemIndex < 0) {
        shoppingList.push(shoppingListItemToAdd)
      } else {
        shoppingList[shoppingListItemIndex].quantity += shoppingListItemToAdd.quantity

        if (shoppingList[shoppingListItemIndex].price != null
          && shoppingListItemToAdd.unitPrice != null) {
          shoppingList[shoppingListItemIndex].price.value += shoppingListItemToAdd.unitPrice.value * shoppingListItemToAdd.quantity
          shoppingList[shoppingListItemIndex].price.valueInMainCurrency += shoppingListItemToAdd.unitPrice.valueInMainCurrency * shoppingListItemToAdd.quantity
        }
      }
    }

    return shoppingList
  }

  /**
   * Gets the modifiers obtained from a wearable item including or not its mods.
   * @param inventoryItem - Inventory item.
   * @returns Wearable modifiers.
   */
  public async getWearableModifiersAsync(inventoryItem: IInventoryItem): Promise<IWearableModifiers> {
    const item = await Services.get(ItemService).getItemAsync(inventoryItem.itemId)

    if (!Services.get(ItemPropertiesService).isWearable(item)) {
      return {
        ergonomicsModifierPercentage: 0,
        movementSpeedModifierPercentage: 0,
        turningSpeedModifierPercentage: 0
      }
    }

    const wearable = item as IWearable

    let ergonomicsModifierPercentage = wearable.ergonomicsModifierPercentage
    let movementSpeedModifierPercentage = wearable.movementSpeedModifierPercentage
    let turningSpeedModifierPercentage = wearable.turningSpeedModifierPercentage

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modWearableModifiers = await this.getWearableModifiersAsync(modSlot.item)
      ergonomicsModifierPercentage += modWearableModifiers.ergonomicsModifierPercentage
      movementSpeedModifierPercentage += modWearableModifiers.movementSpeedModifierPercentage
      turningSpeedModifierPercentage += modWearableModifiers.turningSpeedModifierPercentage
    }

    return {
      ergonomicsModifierPercentage,
      movementSpeedModifierPercentage,
      turningSpeedModifierPercentage
    }
  }

  /**
   * Gets the weight of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @returns Weight.
   */
  public async getWeightAsync(inventoryItem: IInventoryItem): Promise<IWeight> {
    const item = await Services.get(ItemService).getItemAsync(inventoryItem.itemId)
    const weight = item.weight * inventoryItem.quantity
    let weightWithContent = weight

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modWeight = await this.getWeightAsync(modSlot.item)
      weightWithContent += modWeight.weightWithContent
    }

    for (const containedItem of inventoryItem.content) {
      /* c8 ignore start */ // !!! WORKAROUNG !!! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
      if (containedItem == null) {
        continue
      }
      /* c8 ignore stop */

      const containedItemWeight = await this.getWeightAsync(containedItem)
      weightWithContent += containedItemWeight.weightWithContent
    }

    return {
      weight: weight,
      weightWithContent: weightWithContent,
      unitWeight: item.weight
    }
  }

  /**
   * Converts an inventory item to a text.
   * @param inventorySlot - Inventory item to convert.
   * @param options - Options.
   * @param itemInSameSlotInPreset - Preset item that is place in the same slot of a preset. If not null, this means that inventoryItem has been placed in the content or mods of a parent item that is a preset. When inventoryItem and itemInSameSlotInPreset are the same, this means that the price of inventoryItem must be ignored because its part of a preset.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   */
  public async toTextAsync(inventoryItem: IInventoryItem, options: IBuildsToTextOptions, itemInSameSlotInPreset?: IInventoryItem, indentationLevel = 0, canBeLooted = true): Promise<string> {
    const boldToken = options.type === BuildsToTextType.markdown ? '**' : ''
    const italicToken = options.type === BuildsToTextType.markdown ? '*' : ''
    const lineEnd = options.type === BuildsToTextType.markdown ? '  ' : ''

    const itemService = Services.get(ItemService)

    let inventoryItemAsString = ''
    const mainCurrency = itemService.getMainCurrency()
    const item = await itemService.getItemAsync(inventoryItem.itemId)
    const hasPrice = options.includePrices
      && canBeLooted
      && !inventoryItem.ignorePrice
      && inventoryItem.itemId !== itemInSameSlotInPreset?.itemId

    if (inventoryItem.itemId !== itemInSameSlotInPreset?.itemId) {
      const itemCountAsString = inventoryItem.quantity > 1 ? `${inventoryItem.quantity} x ` : ''
      inventoryItemAsString += `${itemCountAsString}${boldToken}${item.name}${boldToken}`
    }

    if (hasPrice) {
      const price = await this.getPriceAsync(inventoryItem, itemInSameSlotInPreset, canBeLooted)

      if (price.unitPriceIgnoreStatus !== IgnoredUnitPrice.inPreset) {
        if (price.missingPrice && price.unitPrice.valueInMainCurrency === 0) {
          inventoryItemAsString += `   ${StringUtils.getTextStatEmoji(options, '💵')}${this.translate('message.noMerchant', options.language)}`
        } else {
          inventoryItemAsString += `   ${StringUtils.getTextStatEmoji(options, '💵')}${this.translate('caption.merchant_' + price.unitPrice.merchant, options.language)}`

          if (price.unitPrice.merchant !== 'flea-market') {
            inventoryItemAsString += ` ${price.unitPrice.merchantLevel}`
          }

          if (price.unitPrice.currencyName === 'barter') {
            inventoryItemAsString += ` (${italicToken}${this.translate('caption.barter', options.language).toLocaleLowerCase()}${italicToken}) ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.price.valueInMainCurrency, options.language)}${mainCurrency.symbol}${boldToken}`
          } else {
            inventoryItemAsString += ` ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.price.value, options.language)}`

            if (price.price.currencyName === mainCurrency.name) {
              inventoryItemAsString += `${mainCurrency.symbol}${boldToken}`
            } else {
              const priceCurrency = itemService.getCurrency(price.price.currencyName)
              inventoryItemAsString += `${priceCurrency.symbol}${boldToken} (= ${boldToken}${StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.price.valueInMainCurrency, options.language)}${mainCurrency.symbol}${boldToken})`
            }
          }
        }
      }
    }

    if (inventoryItemAsString !== '') {
      inventoryItemAsString += `${lineEnd}`
    }

    if (inventoryItem.content.length > 0 || inventoryItem.modSlots.length > 0) {
      let preset = itemInSameSlotInPreset

      if (preset == null) {
        preset = Services.get(PresetService).getPreset(inventoryItem.itemId)
      }

      indentationLevel++
      let indentation = ''

      for (let i = 1; i <= indentationLevel; i++) {
        indentation += ' '
      }

      // Mods
      for (const modSlot of inventoryItem.modSlots) {
        if (modSlot.item == null) {
          continue
        }

        const modSlotInPreset = preset?.modSlots.find(ms => ms.modSlotName === modSlot.modSlotName)
        const modSlotItemAsString = await this.toTextAsync(modSlot.item, options, modSlotInPreset?.item, indentationLevel)

        if (modSlotItemAsString !== '') {
          const modSlotName = this.translate('caption.modSlot_' + modSlot.modSlotName, options.language)

          if (modSlotItemAsString.startsWith('\n')) {
            inventoryItemAsString += `\n${indentation}[${italicToken}${modSlotName}${italicToken}]${lineEnd}${modSlotItemAsString}`
          } else {
            inventoryItemAsString += `\n${indentation}[${italicToken}${modSlotName}${italicToken}] ${modSlotItemAsString}`
          }
        }
      }

      // Content
      for (let i = 0; i < inventoryItem.content.length; i++) {
        const containedItem = inventoryItem.content[i]
        const containedItemInPreset = preset?.content[i]
        const containedItemAsString = await this.toTextAsync(containedItem, options, containedItemInPreset, indentationLevel)

        if (containedItemAsString !== '') {
          inventoryItemAsString += `\n${indentation}${containedItemAsString}`
        }
      }
    }

    return inventoryItemAsString
  }

  /**
   * Gets the recoil modifier of the ammunition contained in the magazine of a ranged weapon.
   * @param modSlots - Mod slots.
   * @returns Recoil modifier.
   */
  private async getChamberedAmmunitionRecoilModifierAsync(modSlots: IInventoryModSlot[]): Promise<number> {
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
      return 0
    }

    const item = await Services.get(ItemService).getItemAsync(ammunitionId)
    const ammunition = item as IAmmunition

    return ammunition.recoilModifier
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
