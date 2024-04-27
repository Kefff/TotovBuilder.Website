import InventorySlotTypes from '../data/inventory-slot-types.json'
import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IQuest } from '../models/configuration/IQuest'
import { IAmmunition } from '../models/item/IAmmunition'
import { IArmor } from '../models/item/IArmor'
import { IArmorMod } from '../models/item/IArmorMod'
import { IBackpack } from '../models/item/IBackpack'
import { IBarterItem } from '../models/item/IBarterItem'
import { IContainer } from '../models/item/IContainer'
import { IEyewear } from '../models/item/IEyewear'
import { IGrenade } from '../models/item/IGrenade'
import { IHeadwear } from '../models/item/IHeadwear'
import { IItem } from '../models/item/IItem'
import { IMagazine } from '../models/item/IMagazine'
import { IMeleeWeapon } from '../models/item/IMeleeWeapon'
import { IMod } from '../models/item/IMod'
import { IModSlot } from '../models/item/IModSlot'
import { IModdable } from '../models/item/IModdable'
import { IPrice } from '../models/item/IPrice'
import { IRangedWeapon } from '../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../models/item/IRangedWeaponMod'
import { IVest } from '../models/item/IVest'
import { IWearable } from '../models/item/IWearable'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { BuildService } from './BuildService'
import { ItemPropertiesService } from './ItemPropertiesService'
import Services from './repository/Services'

/**
 * Represents a service responsible for parsing reduced serialized elements and reducing elements in order to take less space.
 */
export class ReductionService {
  /**
     * Parses a reduced build.
     * @param reducedBuild - Reduced build.
     * @returns Build.
     */
  public parseReducedBuild(reducedBuild: Record<string, unknown>): Result<IBuild> {
    const reducedInventorySlots = reducedBuild['s'] as Record<string, unknown>[]

    if (reducedInventorySlots == null) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedBuild()', vueI18n.t('message.cannotParseBuildWithoutInventorySlots'))
    }

    const build = Services.get(BuildService).create(true)
    build.name = reducedBuild['n'] as string ?? ''

    for (const reducedInventorySlot of reducedInventorySlots) {
      const inventorySlotResult = this.parseReducedInventorySlot(reducedInventorySlot)

      if (!inventorySlotResult.success) {
        return Result.failFrom(inventorySlotResult)
      }

      const index = build.inventorySlots.findIndex(is => is.typeId === inventorySlotResult.value.typeId)

      for (let i = 0; i < inventorySlotResult.value.items.length; i++) {
        build.inventorySlots[index].items[i] = inventorySlotResult.value.items[i]
      }
    }

    return Result.ok(build)
  }

  /**
   * Parses a reduced inventory item.
   * @param reducedInventoryItem - Reduced inventory item.
   * @returns Inventory item.
   */
  public parseReducedInventoryItem(reducedInventoryItem: Record<string, unknown>): Result<IInventoryItem> {
    const itemId = reducedInventoryItem['i'] as string

    if (itemId == null) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedInventoryItem()', vueI18n.t('message.cannotParseInventoryItemWithoutItemId'))
    }

    const ignorePrice = reducedInventoryItem['p'] != null
    let quantity = reducedInventoryItem['q'] as number

    if (quantity == null) {
      quantity = 1
    }

    const reducedContainedItems = reducedInventoryItem['c'] as Record<string, unknown>[]
    const containedItems: IInventoryItem[] = []

    if (reducedContainedItems != null) {
      for (const reducedContainedItem of reducedContainedItems) {
        const itemResult = this.parseReducedInventoryItem(reducedContainedItem)

        if (!itemResult.success) {
          return Result.failFrom(itemResult)
        }

        containedItems.push(itemResult.value)
      }
    }

    const reducedModSlots = reducedInventoryItem['m'] as Record<string, unknown>[]
    const modSlots: IInventoryModSlot[] = []

    if (reducedModSlots != null) {
      for (const reducedModSlot of reducedModSlots) {
        const modSlotResult = this.parseReducedInventoryModSlot(reducedModSlot)

        if (!modSlotResult.success) {
          return Result.failFrom(modSlotResult)
        }

        modSlots.push(modSlotResult.value)
      }
    }

    return Result.ok({
      content: containedItems,
      ignorePrice,
      itemId,
      modSlots,
      quantity
    })
  }

  /**
   * Parses a reduced item.
   * @param reducedItem - Reduced item.
   * @returns Item.
   */
  public parseReducedItem(reducedItem: Record<string, unknown>): IItem {
    const itemPropertiesService = Services.get(ItemPropertiesService)
    let item = this.parseReducedItemBaseProperties(reducedItem)

    switch (true) {
      case itemPropertiesService.isAmmunition(item):
        item = this.parseReducedAmmunition(reducedItem, item)
        break
      case itemPropertiesService.isArmor(item):
        item = this.parseReducedArmor(reducedItem, item)
        break
      case itemPropertiesService.isArmorMod(item):
        item = this.parseReducedArmorMod(reducedItem, item)
        break
      case itemPropertiesService.isBackpack(item):
        item = this.parseReducedBackpack(reducedItem, item)
        break
      case itemPropertiesService.isContainer(item):
        item = this.parseReducedContainer(reducedItem, item)
        break
      case itemPropertiesService.isEyewear(item):
        item = this.parseReducedEyewear(reducedItem, item)
        break
      case itemPropertiesService.isGrenade(item):
        item = this.parseReducedGrenade(reducedItem, item)
        break
      case itemPropertiesService.isHeadwear(item):
        item = this.parseReducedHeadwear(reducedItem, item)
        break
      case itemPropertiesService.isMagazine(item):
        item = this.parseReducedMagazine(reducedItem, item)
        break
      case itemPropertiesService.isMeleeWeapon(item):
        item = this.parseReducedMeleeWeapon(reducedItem, item)
        break
      case itemPropertiesService.isMod(item):
        item = this.parseReducedMod(reducedItem, item)
        break
      case itemPropertiesService.isRangedWeapon(item):
        item = this.parseReducedRangedWeapon(reducedItem, item)
        break
      case itemPropertiesService.isRangedWeaponMod(item):
        item = this.parseReducedRangedWeaponMod(reducedItem, item)
        break
      case itemPropertiesService.isVest(item):
        item = this.parseReducedVest(reducedItem, item)
        break
      default:
        break
    }

    return item
  }

  /**
   * Parses a reduced price.
   * @param reducedPrice - Reduced price.
   * @returns Price.
   */
  public parseReducedPrice(reducedPrice: Record<string, unknown>): IPrice {
    const barterItems: IBarterItem[] = []
    const currencyName = reducedPrice['c'] as string ?? 'RUB'
    const itemId = reducedPrice['i'] as string
    const merchant = reducedPrice['m'] as string ?? 'flea-market'
    const merchantLevel = reducedPrice['ml'] as number ?? 0
    let quest: IQuest | undefined = undefined
    const value = reducedPrice['v'] as number ?? 0
    const valueInMainCurrency = reducedPrice['vm'] as number ?? 0

    const reducedBarterItems = reducedPrice['b'] as Record<string, unknown>[]
    const reducedQuest = reducedPrice['q'] as Record<string, unknown>

    if (reducedBarterItems != null) {
      for (const reducedBarterItem of reducedBarterItems) {
        const barterItemId = reducedBarterItem['i'] as string
        const barterItemQuantity = reducedBarterItem['q'] as number ?? 1

        barterItems.push({
          itemId: barterItemId,
          quantity: barterItemQuantity
        })
      }
    }

    if (reducedQuest != null) {
      const questId = reducedQuest['i'] as string
      const questName = reducedQuest['n'] as string
      const questWikiLink = reducedQuest['w'] as string

      quest = {
        id: questId,
        name: questName,
        wikiLink: questWikiLink
      }
    }

    return {
      barterItems,
      currencyName,
      itemId,
      merchant,
      merchantLevel,
      quest,
      value,
      valueInMainCurrency
    }
  }

  /**
   * Transforms a build to a reduced form in order to take less space.
   * Unnecessary data is scrapped and property names are shortened.
   * @param build - Build.
   * @returns Reduced build.
   */
  public reduceBuild(build: IBuild): Record<string, unknown> {
    const reducedBuild: Record<string, unknown> = {}
    const reducedInventorySlots: Record<string, unknown>[] = []

    for (const inventorySlot of build.inventorySlots.filter(is => is.items.some(i => i != null))) {
      const reducedInventorySlot = this.reduceInventorySlot(inventorySlot)
      reducedInventorySlots.push(reducedInventorySlot)
    }

    reducedBuild['n'] = build.name
    reducedBuild['s'] = reducedInventorySlots

    return reducedBuild
  }

  /**
   * Transforms an inventory item so it takes less place.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryItem - Inventory item.
   * @returns Reduced inventory item.
   */
  public reduceInventoryItem(inventoryItem: IInventoryItem): Record<string, unknown> {
    const reducedInventoryItem: Record<string, unknown> = {}
    const reducedContentainedItems: Record<string, unknown>[] = []
    const reducedModSlots: Record<string, unknown>[] = []

    reducedInventoryItem['i'] = inventoryItem.itemId

    if (inventoryItem.ignorePrice) {
      reducedInventoryItem['p'] = 1
    }

    if (inventoryItem.quantity > 1) {
      reducedInventoryItem['q'] = inventoryItem.quantity
    }

    for (const containedItem of inventoryItem.content) {
      const reducedContainedItem = this.reduceInventoryItem(containedItem)
      reducedContentainedItems.push(reducedContainedItem)
    }

    for (const modSlot of inventoryItem.modSlots.filter(ms => ms.item != null)) {
      const reducedModSlot = this.reduceInventoryModSlot(modSlot)
      reducedModSlots.push(reducedModSlot)
    }

    if (reducedContentainedItems.length > 0) {
      reducedInventoryItem['c'] = reducedContentainedItems
    }

    if (reducedModSlots.length > 0) {
      reducedInventoryItem['m'] = reducedModSlots
    }

    return reducedInventoryItem
  }

  /**
   * Parses a reduced ammunition.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedAmmunition(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IAmmunition {
    const accuracyPercentageModifier = reducedItem['ac'] as number ?? 0
    const armorDamagePercentage = reducedItem['ad'] as number ?? 0
    const armorPenetrations = reducedItem['ap'] as number[] ?? [0, 0, 0, 0, 0, 0]
    const blinding = reducedItem['b'] != null
    const caliber = reducedItem['ca'] as string
    const durabilityBurnPercentageModifier = reducedItem['d'] as number ?? 0
    const fleshDamage = reducedItem['f'] as number ?? 0
    const fragmentationChancePercentage = reducedItem['fr'] as number ?? 0
    const heavyBleedingPercentageChance = reducedItem['h'] as number ?? 0
    const lightBleedingPercentageChance = reducedItem['l'] as number ?? 0
    const penetrationPower = reducedItem['pp'] as number ?? 0
    const projectiles = reducedItem['p'] as number ?? 1
    const recoilPercentageModifier = reducedItem['r'] as number ?? 0
    const subsonic = reducedItem['su'] != null
    const tracer = reducedItem['t'] != null
    const velocity = reducedItem['v'] as number

    return {
      ...baseItemProperties,
      accuracyPercentageModifier,
      armorDamagePercentage,
      armorPenetrations,
      blinding,
      caliber,
      durabilityBurnPercentageModifier,
      fleshDamage,
      fragmentationChancePercentage,
      heavyBleedingPercentageChance,
      lightBleedingPercentageChance,
      penetrationPower,
      projectiles,
      recoilPercentageModifier,
      subsonic,
      tracer,
      velocity
    }
  }

  /**
   * Parses a reduced armor.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedArmor(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IArmor {
    const moddableProperties = this.parseReducedModdable(reducedItem, baseItemProperties)
    const wearableProperties = this.parseReducedWearable(reducedItem, baseItemProperties)

    const armorClass = reducedItem['ac'] as number ?? 0
    const armoredAreas = reducedItem['aa'] as string[] ?? []
    const durability = reducedItem['d'] as number ?? 0
    const material = reducedItem['ma'] as string ?? ''

    return {
      ...baseItemProperties,
      ...moddableProperties,
      ...wearableProperties,
      armorClass,
      armoredAreas,
      durability,
      material
    }
  }

  /**
   * Parses a reduced armor mod.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedArmorMod(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IArmorMod {
    const armorProperties = this.parseReducedArmor(reducedItem, baseItemProperties)

    const blindnessProtectionPercentage = reducedItem['bp'] as number ?? 0

    return {
      ...baseItemProperties,
      ...armorProperties,
      blindnessProtectionPercentage
    }
  }

  /**
   * Parses a reduced backpack.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedBackpack(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IBackpack {
    const containerProperties = this.parseReducedContainer(reducedItem, baseItemProperties)
    const wearableProperties = this.parseReducedWearable(reducedItem, baseItemProperties)

    return {
      ...baseItemProperties,
      ...containerProperties,
      ...wearableProperties
    }
  }

  /**
   * Parses a reduced container.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedContainer(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IContainer {
    const capacity = reducedItem['ca'] as number ?? 0

    return {
      ...baseItemProperties,
      capacity
    }
  }

  /**
   * Parses a reduced eyewear.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedEyewear(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IEyewear {
    const blindnessProtectionPercentage = reducedItem['bp'] as number

    return {
      ...baseItemProperties,
      blindnessProtectionPercentage
    }
  }

  /**
   * Parses a reduced grenade.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedGrenade(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IGrenade {
    const explosionDelay = reducedItem['d'] as number
    const fragmentsAmount = reducedItem['f'] as number ?? 0
    const maximumExplosionRange = reducedItem['ma'] as number ?? 0
    const minimumExplosionRange = reducedItem['mi'] as number ?? 0
    const type = reducedItem['t'] as string

    return {
      ...baseItemProperties,
      explosionDelay,
      fragmentsAmount,
      maximumExplosionRange,
      minimumExplosionRange,
      type
    }
  }

  /**
   * Parses a reduced headwear.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedHeadwear(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IHeadwear {
    const armorProperties = this.parseReducedArmor(reducedItem, baseItemProperties)

    const blocksHeadphones = reducedItem['h'] != null
    const deafening = reducedItem['de'] as string ?? 'None'
    const ricochetChance = reducedItem['r'] as string ?? ''

    return {
      ...baseItemProperties,
      ...armorProperties,
      blocksHeadphones,
      deafening,
      ricochetChance
    }
  }

  /**
   * Parses a reduced magazine.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedMagazine(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IMagazine {
    const containerProperties = this.parseReducedContainer(reducedItem, baseItemProperties)
    const modProperties = this.parseReducedMod(reducedItem, baseItemProperties)

    const acceptedAmmunitionIds = reducedItem['aa'] as string[]
    const checkSpeedPercentageModifier = reducedItem['cs'] as number ?? 0
    const loadSpeedPercentageModifier = reducedItem['l'] as number ?? 0
    const malfunctionPercentage = reducedItem['ma'] as number ?? 0

    return {
      ...baseItemProperties,
      ...containerProperties,
      ...modProperties,
      acceptedAmmunitionIds,
      checkSpeedPercentageModifier,
      loadSpeedPercentageModifier,
      malfunctionPercentage
    }
  }

  /**
   * Parses a reduced melee weapon.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedMeleeWeapon(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IMeleeWeapon {
    const chopDamage = reducedItem['ch'] as number
    const hitRadius = reducedItem['r'] as number
    const stabDamage = reducedItem['st'] as number

    return {
      ...baseItemProperties,
      chopDamage,
      hitRadius,
      stabDamage
    }
  }

  /**
   * Parses a reduced mod.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedMod(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IMod {
    const moddableProperties = this.parseReducedModdable(reducedItem, baseItemProperties)

    const ergonomicsModifier = reducedItem['e'] as number ?? 0

    return {
      ...baseItemProperties,
      ...moddableProperties,
      ergonomicsModifier,
      presetErgonomicsModifier: undefined
    }
  }

  /**
   * Parses a reduced moddable.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedModdable(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IModdable {
    const baseItemId = reducedItem['bi'] as string ?? undefined
    const defaultPresetId = reducedItem['dp'] as string ?? undefined
    const modSlots: IModSlot[] = []

    const reducedModSlots = reducedItem['mo'] as Record<string, unknown>[]

    if (reducedModSlots != null) {
      for (const reducedModSlot of reducedModSlots) {
        const modSlotCompatibleItemIds = reducedModSlot['i'] as string[] ?? []
        const modSlotMaxStackableAmount = reducedModSlot['a'] as number ?? 1
        const modSlotName = reducedModSlot['n'] as string
        const modSlotRequired = reducedModSlot['r'] != null

        modSlots.push({
          compatibleItemIds: modSlotCompatibleItemIds,
          maxStackableAmount: modSlotMaxStackableAmount,
          name: modSlotName,
          required: modSlotRequired
        })
      }
    }

    return {
      ...baseItemProperties,
      baseItemId,
      defaultPresetId,
      modSlots
    }
  }

  /**
   * Parses a reduced ranged weapon.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedRangedWeapon(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IRangedWeapon {
    const moddableProperties = this.parseReducedModdable(reducedItem, baseItemProperties)

    const caliber = reducedItem['ca'] as string
    const ergonomics = reducedItem['e'] as number
    const fireModes = reducedItem['fm'] as string[] ?? ['SingleFire']
    const fireRate = reducedItem['r'] as number
    const horizontalRecoil = reducedItem['h'] as number
    const minuteOfAngle = reducedItem['ma'] as number ?? undefined
    const verticalRecoil = reducedItem['v'] as number

    return {
      ...baseItemProperties,
      ...moddableProperties,
      caliber,
      ergonomics,
      fireModes,
      fireRate,
      horizontalRecoil,
      minuteOfAngle,
      presetErgonomics: undefined,
      presetHorizontalRecoil: undefined,
      presetVerticalRecoil: undefined,
      verticalRecoil
    }
  }

  /**
   * Parses a reduced ranged weapon mod.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedRangedWeaponMod(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IRangedWeaponMod {
    const modProperties = this.parseReducedMod(reducedItem, baseItemProperties)

    const accuracyPercentageModifier = reducedItem['ac'] as number ?? 0
    const recoilPercentageModifier = reducedItem['r'] as number ?? 0

    return {
      ...baseItemProperties,
      ...modProperties,
      accuracyPercentageModifier,
      presetRecoilPercentageModifier: undefined,
      recoilPercentageModifier
    }
  }

  /**
   * Parses a reduced vest.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedVest(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IVest {
    const armorProperties = this.parseReducedArmor(reducedItem, baseItemProperties)
    const containerProperties = this.parseReducedContainer(reducedItem, baseItemProperties)

    return {
      ...baseItemProperties,
      ...armorProperties,
      ...containerProperties
    }
  }

  /**
   * Parses a reduced wearable.
   * @param reducedItem - Reduced item.
   * @param baseItemProperties - Item representing the parsed base item properties.
   * @returns Item.
   */
  private parseReducedWearable(reducedItem: Record<string, unknown>, baseItemProperties: IItem): IWearable {
    const ergonomicsPercentageModifier = reducedItem['e'] as number ?? 0
    const movementSpeedPercentageModifier = reducedItem['ms'] as number ?? 0
    const turningSpeedPercentageModifier = reducedItem['t'] as number ?? 0

    return {
      ...baseItemProperties,
      ergonomicsPercentageModifier,
      movementSpeedPercentageModifier,
      presetWearableModifiers: undefined,
      turningSpeedPercentageModifier
    }
  }

  /**
   * Parses a reduced inventory mod slot.
   * @param reducedInventoryModSlot - Reduced inventory mod slot.
   * @returns Mod slot.
   */
  private parseReducedInventoryModSlot(reducedInventoryModSlot: Record<string, unknown>): Result<IInventoryModSlot> {
    const modSlotName = reducedInventoryModSlot['n'] as string

    if (modSlotName == null) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedInventoryModSlot()', vueI18n.t('message.cannotParseInventoryModSlotWithoutModSlotName'))
    }

    let inventoryItem: IInventoryItem | undefined = undefined
    const reducedItem = reducedInventoryModSlot['i'] as Record<string, unknown> | undefined

    if (reducedItem != null) {
      const inventoryItemResult = this.parseReducedInventoryItem(reducedItem)

      if (!inventoryItemResult.success) {
        return Result.failFrom(inventoryItemResult)
      }

      inventoryItem = inventoryItemResult.value
    }

    return Result.ok({
      item: inventoryItem,
      modSlotName
    })
  }

  /**
   * Parses a reduced inventory slot.
   * @param reducedInventorySlot - Reduced inventory slot.
   * @returns Inventory slot.
   */
  private parseReducedInventorySlot(reducedInventorySlot: Record<string, unknown>): Result<IInventorySlot> {
    const reducedItems = reducedInventorySlot['i'] as Record<string, unknown>[]

    if (reducedItems == null || reducedItems.length === 0) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedInventorySlot()', vueI18n.t('message.cannotParseInventorySlotWithoutItems'))
    }

    const typeId = reducedInventorySlot['t'] as string

    if (typeId == null) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedInventorySlot()', vueI18n.t('message.cannotParseInventorySlotWithoutTypeId'))
    }

    const inventorySlotType = InventorySlotTypes.find(ist => ist.id === typeId)

    if (inventorySlotType == null) {
      return Result.fail(FailureType.error, 'ReductionService.parseReducedInventorySlot()', vueI18n.t('message.cannotFindInventorySlotType', { inventorySlotTypeId: typeId }))
    }

    const inventoryItems: IInventoryItem[] = Array(inventorySlotType.itemSlotsAmount)

    for (let i = 0; i < reducedItems.length; i++) {
      const reducedItem = reducedItems[i]
      const inventoryItemResult = this.parseReducedInventoryItem(reducedItem)

      if (!inventoryItemResult.success) {
        return Result.failFrom(inventoryItemResult)
      }

      inventoryItems[i] = inventoryItemResult.value
    }

    return Result.ok({
      items: inventoryItems,
      typeId
    })
  }

  /**
   * Parses the base properties of a reduced item.
   * @param reducedItem - Reduced item.
   * @returns Item.
   */
  private parseReducedItemBaseProperties(reducedItem: Record<string, unknown>): IItem {
    const categoryId = reducedItem['c'] as string ?? 'other'
    const conflictingItemIds = reducedItem['co'] as string[] ?? []
    const iconLink = reducedItem['ic'] as string
    const id = reducedItem['i'] as string
    const imageLink = reducedItem['im'] as string
    const marketLink = reducedItem['m'] as string
    const maxStackableAmount = reducedItem['a'] as number ?? 1
    const name = reducedItem['n'] as string
    const prices: IPrice[] = []
    const shortName = reducedItem['s'] as string
    const weight = reducedItem['w'] as number ?? 0
    const wikiLink = reducedItem['wi'] as string

    return {
      categoryId,
      conflictingItemIds,
      iconLink,
      id,
      imageLink,
      marketLink,
      maxStackableAmount,
      name,
      prices,
      shortName,
      weight,
      wikiLink
    }
  }

  /**
   * Transforms an inventory mod slot so it takes less space.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryModSlot - Inventory mod slot.
   * @returns Reduced inventory mod slot.
   */
  private reduceInventoryModSlot(inventoryModSlot: IInventoryModSlot): Record<string, unknown> {
    const reducedInventoryModSlot: Record<string, unknown> = {}

    reducedInventoryModSlot['n'] = inventoryModSlot.modSlotName

    if (inventoryModSlot.item != null) {
      // Should always occur because we only call this method for mod slots containing an item
      reducedInventoryModSlot['i'] = this.reduceInventoryItem(inventoryModSlot.item)
    }

    return reducedInventoryModSlot
  }

  /**
   * Transforms an inventory slot so it takes less place.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventorySlot - Inventory slot.
   * @returns Reduced inventory slot.
   */
  private reduceInventorySlot(inventorySlot: IInventorySlot): Record<string, unknown> {
    const reducedInventorySlot: Record<string, unknown> = {}
    const reducedInventoryItems: Record<string, unknown>[] = []

    reducedInventorySlot['t'] = inventorySlot.typeId

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == null) {
        continue
      }

      const reducedInventoryItem = this.reduceInventoryItem(inventoryItem)
      reducedInventoryItems.push(reducedInventoryItem)
    }

    reducedInventorySlot['i'] = reducedInventoryItems

    return reducedInventorySlot
  }
}