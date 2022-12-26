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
import Result from '../utils/Result'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { ItemService } from './ItemService'
import { IAmmunition } from '../models/item/IAmmunition'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IPrice } from '../models/item/IPrice'
import { MerchantFilterService } from './MerchantFilterService'
import { PathUtils } from '../utils/PathUtils'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { round } from 'round-ts'
import { TinyEmitter } from 'tiny-emitter'
import { IShoppingListItem } from '../models/build/IShoppingListItem'

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
    } else if (itemPropertiesService.isMod(itemResult.value)) {
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
      ergonomics: round(ergonomics, 1),
      ergonomicsWithMods: round(ergonomicsWithMods, 1)
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
      return Result.failFrom(itemResult)
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
      if (modSlot.item == null) {
        continue
      }

      const modErgonomicsPercentageModifierResult = await this.getErgonomicsPercentageModifier(
        modSlot.item
      )

      if (!modErgonomicsPercentageModifierResult.success) {
        return Result.failFrom(modErgonomicsPercentageModifierResult)
      }

      ergonomicsPercentageModifierWithContent += modErgonomicsPercentageModifierResult.value.ergonomicsPercentageModifierWithContent
    }

    return Result.ok({
      ergonomicsPercentageModifier: round(ergonomicsPercentageModifier, 2),
      ergonomicsPercentageModifierWithContent: round(ergonomicsPercentageModifierWithContent, 2)
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

    if (preset == null) {
      return undefined
    }

    const pathModSlotNames = pathArray.filter(p => p.startsWith(PathUtils.modSlotPrefix)).map(p => p.replace(PathUtils.modSlotPrefix, ''))
    const presetModSlot = this.getPresetModSlot(preset, pathModSlotNames)

    if (presetModSlot?.item?.itemId === itemId) {
      return presetModSlot
    }
  }

  /**
   * Gets the price of an inventory item including or not its content and mods.
   * @param inventoryItem - Inventory item.
   * @param presetModSlotItem - Preset mod slot item used to ignore the price of mods that are installed by default on an item.
   * @param canBeLooted - Indicates wether the item can be looted. If it is not the case, the price of the item is ignored (but the price of its content is still taken into consideration).
   * @param useMerchantFilter - Indicates whether the merchant filter is used. If false, all prices are taken into consideration. Used mainly to ignore merchant filter to be able to display all the prices and barters of an item in its stats.
   * @returns Price.
   */
  public async getPrice(inventoryItem: IInventoryItem, presetModSlotItem?: IInventoryItem, canBeLooted = true, useMerchantFilter = true): Promise<Result<IInventoryPrice>> {
    const merchantFilterService = Services.get(MerchantFilterService)
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
      quest: null,
      value: 0,
      valueInMainCurrency: 0
    }
    const barterItemPrices: IInventoryPrice[] = []
    let unitPriceIgnoreStatus = IgnoredUnitPrice.notIgnored

    if (!canBeLooted) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.notLootable
    } else if (presetModSlotItem?.itemId === inventoryItem.itemId) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.inPreset
    } else if (inventoryItem.ignorePrice) {
      unitPriceIgnoreStatus = IgnoredUnitPrice.manuallyIgnored
    }

    let hasUnitPrice = false

    if (unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored) {
      const matchingPrices = useMerchantFilter ? merchantFilterService.getMatchingPrices(itemResult.value) : itemResult.value.prices

      for (const matchingPrice of matchingPrices) {
        let missingBarterItemPrice = false
        let matchingPriceInMainCurrency = matchingPrice.valueInMainCurrency

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

            barterItemPrices.push(barterItemPriceResult.value)
            matchingPriceInMainCurrency += barterItemPriceResult.value.price.valueInMainCurrency
          }
        }

        if (!missingBarterItemPrice
          && (unitPrice.valueInMainCurrency === 0
            || matchingPriceInMainCurrency < unitPrice.valueInMainCurrency)) {
          unitPrice = {
            // Creating a new instance because we need to set the valueInMainCurrency.
            // If we directly use a reference to matchinPrice.valueInMainCurrency, then we modify this price for the whole application each time we pass here
            ...matchingPrice,
            valueInMainCurrency: matchingPriceInMainCurrency
          }

          hasUnitPrice = true
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

    const inventoryPrice: IInventoryPrice = {
      missingPrice: unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored && !hasUnitPrice,
      price,
      pricesWithContent: [],
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: mainCurrencyResult.value.name,
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
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
          quest: null,
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
                quest: null,
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

    // Adding content prices
    for (const containedItem of inventoryItem.content) {
      /* istanbul ignore if */
      if (containedItem == null) {
        // !!! WORKAROUNG !!! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }

      const containedItemPriceResult = await this.getPrice(containedItem)

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
    if (presetModSlotItem == null) {
      presetModSlotItem = await itemService.getPreset(inventoryItem.itemId)
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const presetModSlot = presetModSlotItem?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
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
      return Result.failFrom(chamberedAmmunitionRecoilPercentageModifierResult)
    }

    const chamberedAmmunitionRecoilPercentageModifier = chamberedAmmunitionRecoilPercentageModifierResult.value

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
    recoil.horizontalRecoilWithMods = round(recoil.horizontalRecoilWithMods * (1 + chamberedAmmunitionRecoilPercentageModifier))
    recoil.verticalRecoilWithMods = recoil.verticalRecoil + (recoil.verticalRecoil * modsRecoilPercentageModifiers)
    recoil.verticalRecoilWithMods = round(recoil.verticalRecoilWithMods * (1 + chamberedAmmunitionRecoilPercentageModifier))

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

    if (!itemPropertiesService.isMod(itemResult.value)) {
      return Result.ok(recoilPercentageModifier)
    }

    if (itemPropertiesService.isRangedWeaponMod(itemResult.value)) {
      recoilPercentageModifier.recoilPercentageModifier = (itemResult.value as IRangedWeaponMod).recoilPercentageModifier
      recoilPercentageModifier.recoilPercentageModifierWithMods = recoilPercentageModifier.recoilPercentageModifier
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const modRecoilPercentageModifierResult = await this.getRecoilPercentageModifier(modSlot.item)

      if (!modRecoilPercentageModifierResult.success) {
        return Result.failFrom(modRecoilPercentageModifierResult)
      }

      recoilPercentageModifier.recoilPercentageModifierWithMods = round(recoilPercentageModifier.recoilPercentageModifierWithMods + modRecoilPercentageModifierResult.value.recoilPercentageModifierWithMods, 2)
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

      let price: IPrice

      // Barters
      const shoppingListBartersToAdd: IShoppingListItem[] = []

      if (priceResult.value.unitPrice.currencyName === 'barter') {
        for (const barterItem of priceResult.value.unitPrice.barterItems) {
          const barterItemShoppingListResult = await this.getShoppingList({
            content: [],
            ignorePrice: false,
            itemId: barterItem.itemId,
            modSlots: [],
            quantity: barterItem.quantity
          })

          if (!barterItemShoppingListResult.success) {
            return Result.failFrom(barterItemShoppingListResult)
          }

          shoppingListBartersToAdd.push(...barterItemShoppingListResult.value)
        }

        // Setting the price of items that have barter items to 0 since barter items and they price are added to the shopping list
        price = {
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
        price = priceResult.value.unitPrice
      }

      shoppingListItemsToAdd.push({
        iconLink: itemResult.value.iconLink,
        id: inventoryItem.itemId,
        name: itemResult.value.name,
        unitPrice: price,
        quantity: inventoryItem.quantity
      }, ...shoppingListBartersToAdd)
    }

    // Mods
    if (presetModSlotItem == null) {
      presetModSlotItem = await itemService.getPreset(inventoryItem.itemId)
    }

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item == null) {
        continue
      }

      const presetModSlot = presetModSlotItem?.modSlots.find(pms => pms.modSlotName === modSlot.modSlotName)
      const shoppingListResult = await this.getShoppingList(modSlot.item, presetModSlot?.item)

      if (!shoppingListResult.success) {
        return Result.failFrom(shoppingListResult)
      }

      shoppingListItemsToAdd.push(...shoppingListResult.value)
    }

    // Content
    for (const content of inventoryItem.content) {
      const shoppingListResult = await this.getShoppingList(content)

      if (!shoppingListResult.success) {
        return Result.failFrom(shoppingListResult)
      }

      shoppingListItemsToAdd.push(...shoppingListResult.value)
    }

    // Regrouping similar items
    for (const shoppingListItemToAdd of shoppingListItemsToAdd) {
      const shoppingListItemIndex = shoppingList.findIndex(sli => sli.id === shoppingListItemToAdd.id)

      if (shoppingListItemIndex < 0) {
        shoppingList.push(shoppingListItemToAdd)
      } else {
        shoppingList[shoppingListItemIndex].quantity += shoppingListItemToAdd.quantity
      }
    }

    return Result.ok(shoppingList)
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
      /* istanbul ignore if */
      if (containedItem == null) {
        // !!! WORKAROUNG !!! In theory it should never happen, but it happened in production without being able to identify the source of the problem.
        continue
      }

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
      weight: round(weight, 3),
      weightWithContent: round(weightWithContent, 3),
      unitWeight: round(itemResult.value.weight, 3)
    })
  }

  /**
   * Gets the recoil percentage modifier of the chambered ammunition (or contained in the magazine when not having a chamber)
   * of a ranged weapon.
   * @param item - Item being checked.
   * @param modSlots - Mod slots.
   * @returns Recoil percentage modifier.
   */
  private async getChamberedAmmunitionRecoilPercentageModifier(item: IItem, modSlots: IInventoryModSlot[]): Promise<Result<number>> {
    const rangedWeapon = item as IRangedWeapon
    let ammunitionId: string | undefined

    const chamber = rangedWeapon.modSlots.find((ms) => ms.name.startsWith('chamber'))

    for (const modSlot of modSlots) {
      if (chamber != null && modSlot.modSlotName === chamber.name && modSlot.item != null) {
        ammunitionId = modSlot.item.itemId

        break
      } else {
        const magazine = rangedWeapon.modSlots.find((ms) => ms.name === 'mod_magazine')

        if (modSlot.modSlotName !== /* istanbul ignore next */magazine?.name || modSlot.item == null) {
          continue
        }

        if (modSlot.item.content.length === 0 && modSlot.item.modSlots.length > 0) {
          // The magazine is composed of multiple slots that each receive a cartridge (revolver cylinder magazine)
          ammunitionId = modSlot.item.modSlots.filter(ms => ms.item != null)[0]?.item?.itemId
        } else {
          // Normal magazine
          ammunitionId = modSlot.item.content[0]?.itemId
        }
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

  /**
   * Gets the mod slot in a preset corresponding to a mod slot path.
   * @param presetInventoryItem - Preset.
   * @param pathModSlotNames - Names of the mod slots present in a path leading to a mod.
   * @returns Mod slot path corresponding to the mod slot path.
   */
  private getPresetModSlot(presetInventoryItem: IInventoryItem, pathModSlotNames: string[]): IInventoryModSlot | undefined {
    const presetModSlot = presetInventoryItem.modSlots.find(ms => ms.modSlotName === pathModSlotNames[0])

    if (presetModSlot == null) {
      return undefined
    }

    if (pathModSlotNames.length > 1) {
      /* istanbul ignore else */
      if (presetModSlot.item != null) {
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
