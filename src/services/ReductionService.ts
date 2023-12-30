import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import InventorySlotTypes from '../data/inventory-slot-types.json'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IBuild } from '../models/build/IBuild'
import { IPrice } from '../models/item/IPrice'
import { IItem } from '../models/item/IItem'
import { BuildService } from './BuildService'
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
      return Result.fail(FailureType.error, 'BuildService.parseReducedBuild()', vueI18n.t('message.cannotParseBuildWithoutInventorySlots'))
    }

    const build = Services.get(BuildService).create()

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
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryItem()', vueI18n.t('message.cannotParseInventoryItemWithoutItemId'))
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
  public parseReducedItem(reducedItem: Record<string, unknown>): Result<IItem> {
    return Result.ok()
  }

  /**
   * Parses a reduced price.
   * @param reducedPrice - Reduced price.
   * @returns Price.
   */
  public parseReducedPrice(reducedPrice: Record<string, unknown>): Result<IPrice> {
    return Result.ok()
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
      // reducedInventoryItem['p'] = 1 // We don't set the boolean value, just having the property indicates that it is true
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
   * Parses a reduced inventory mod slot.
   * @param reducedInventoryModSlot - Reduced inventory mod slot.
   * @returns Mod slot.
   */
  private parseReducedInventoryModSlot(reducedInventoryModSlot: Record<string, unknown>): Result<IInventoryModSlot> {
    const modSlotName = reducedInventoryModSlot['n'] as string

    if (modSlotName == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryModSlot()', vueI18n.t('message.cannotParseInventoryModSlotWithoutModSlotName'))
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
      modSlotName,
      item: inventoryItem
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
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', vueI18n.t('message.cannotParseInventorySlotWithoutItems'))
    }

    const typeId = reducedInventorySlot['t'] as string

    if (typeId == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', vueI18n.t('message.cannotParseInventorySlotWithoutTypeId'))
    }

    const inventorySlotType = InventorySlotTypes.find(ist => ist.id === typeId)

    if (inventorySlotType == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', vueI18n.t('message.cannotFindInventorySlotType', { inventorySlotTypeId: typeId }))
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