import { Guid } from 'guid-typescript'
import { IBuild } from '../models/build/IBuild'
import Result, { FailureType } from '../utils/Result'
import InventorySlotTypes from '../assets/data/inventory-slot-types.json'
import { IInventoryItem } from '../models/build/IInventoryItem'
import i18n from '../plugins/vueI18n'
import Configuration from '../../test-data/configuration.json'
import jsonUrl from 'json-url'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IInventorySlot } from '../models/build/IInventorySlot'

/**
 * Represents a service responsible for managing builds.
 */
export class BuildService {
  /**
   * Adds build.
   * @param build - Build to add.
   * @returns Build ID.
   */
  public add(build: IBuild): string {
    build.id = Guid.create().toString()
    const storageKey = this.getKey(build.id)
    localStorage.setItem(storageKey, JSON.stringify(build))

    return build.id
  }

  /**
   * Creates a new build.
   * @returns New build.
   */
  public create(): IBuild {
    const newBuild: IBuild = {
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date()
    }

    for (const inventorySlotType of InventorySlotTypes.sort((inventorySlotType1, inventorySlotType2) => inventorySlotType1.displayOrder - inventorySlotType2.displayOrder)) {
      const items = new Array<IInventoryItem>(inventorySlotType.itemSlotsAmount)

      if (inventorySlotType.defaultItemsIds != undefined) {
        for (let i = 0; i < inventorySlotType.defaultItemsIds.length; i++) {
          items[i] = {
            content: [],
            ignorePrice: false,
            itemId: inventorySlotType.defaultItemsIds[i],
            modSlots: [],
            quantity: 1
          }
        }
      }

      newBuild.inventorySlots.push({
        items,
        typeId: inventorySlotType.id
      })
    }

    return newBuild
  }

  /**
   * Deletes a build.
   * @param id - Build ID.
   */
  public delete(id: string): void {
    const storageKey = this.getKey(id)
    localStorage.removeItem(storageKey)
  }

  /**
   * Converts an encoded string that can be shared in a URL to a build.
   * @param sharableString - Encoded string that can be shared in a URL.
   * @returns Build.
   */
  public async fromSharableString(sharableString: string): Promise<Result<IBuild>> {
    const codec = jsonUrl('lzma')
    let reducedBuild: Record<string, unknown>

    try {
      reducedBuild = (await codec.decompress(sharableString)) as Record<string, unknown>
    } catch {
      return Result.fail(FailureType.error, 'BuildService.fromSharableString()', i18n.t('message.invalidSharableString'))
    }

    const buildResult = this.parseReducedBuild(reducedBuild)

    if (!buildResult.success) {
      return Result.fail(FailureType.error, 'BuildService.fromSharableString()', i18n.t('message.invalidSharableString'))
    }

    return Result.ok(buildResult.value)
  }

  /**
   * Gets a build.
   * @param id - Build ID.
   * @returns The build if it was found.
   */
  public get(id: string): Result<IBuild> {
    const storageKey = this.getKey(id)
    const serializedBuild = localStorage.getItem(storageKey)

    if (serializedBuild !== null) {
      const build = JSON.parse(serializedBuild) as IBuild

      // Converting dates back to Date type
      build.lastUpdated = new Date(build.lastUpdated as unknown as string)

      if (build.lastExported !== undefined) {
        build.lastExported = new Date(build.lastExported as unknown as string)
      }

      return Result.ok(build)
    }

    return Result.fail<IBuild>(
      FailureType.warning,
      'BuildService.update()',
      i18n.t('message.buildNotFound', { id })
    )
  }

  /**
   * Gets all builds.
   * @returns All builds.
   */
  public getAll(): IBuild[] {
    const builds: IBuild[] = []
    const buildKeyPrefix = Configuration.VITE_BUILD_KEY_PREFIX as string

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) // Key could potentially be null if a build is deleted while looping, but it is hardly testable

      /* istanbul ignore else */
      if (key !== null) {
        if (key.startsWith(buildKeyPrefix)) {
          const id = key.slice(buildKeyPrefix.length)
          const result = this.get(id)
          builds.push(result.value)
        }
      }
    }

    return builds
  }

  /**
   * Parses a build that was reduced for sharing.
   * @param serializedBuild - Serialized build.
   * @returns Build.
   */
  public parseReducedBuild(reducedBuild: Record<string, unknown>): Result<IBuild> {
    const reducedInventorySlots = reducedBuild['s'] as Record<string, unknown>[]

    if (reducedInventorySlots === undefined || reducedInventorySlots.length === 0) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedBuild()', i18n.t('message.cannotParseBuildWithoutInventorySlots'))
    }

    const build = this.create()

    for (const reducedInventorySlot of reducedInventorySlots) {
      const inventorySlotResult = this.parseReducedInventorySlot(reducedInventorySlot)

      if (!inventorySlotResult.success) {
        return Result.failFrom(inventorySlotResult)
      }

      const index = build.inventorySlots.findIndex(is => is.typeId === inventorySlotResult.value.typeId)

      if (index < 0) {
        return Result.fail(FailureType.error, 'BuildService.parseReducedBuild()', i18n.t('message.cannotFindInventorySlotType', { inventorySlotTypeId: inventorySlotResult.value.typeId }))
      }

      build.inventorySlots[index] = inventorySlotResult.value
    }

    return Result.ok(build)
  }

  /**
   * Transforms a build in order to share it.
   * Unnecessary data is scrapped and property names are shortened.
   * @param build - Build.
   * @returns Reduced build.
   */
  public reduceBuildForSharing(build: IBuild): Result<Record<string, unknown>> {
    const reducedBuild: Record<string, unknown> = {}
    const reducedInventorySlots: Record<string, unknown>[] = []

    for (const inventorySlot of build.inventorySlots.filter(is => is.items.some(i => i != undefined))) {
      const reducedInventorySlot = this.reduceInventorySlotForSharing(inventorySlot)
      reducedInventorySlots.push(reducedInventorySlot)
    }

    if (reducedInventorySlots.length === 0) {
      return Result.fail(FailureType.error, 'BuildService.parseBuildForSharing()', i18n.t('message.cannotShareEmptyBuild', { name: build.name }))
    }

    reducedBuild['s'] = reducedInventorySlots

    return Result.ok(reducedBuild)
  }

  /**
   * Converts a build to an encoded URL that can be shared.
   * @param build - Build.
   * @returns Encoded URL.
   */
  public async toSharableURL(build: IBuild): Promise<Result<string>> {
    // Reducing the size of the build
    const reducedBuildResult = this.reduceBuildForSharing(build)

    if (!reducedBuildResult.success) {
      return Result.failFrom(reducedBuildResult)
    }

    // Compressing the build into a URL
    const codec = jsonUrl('lzma')
    let sharableURL = Configuration.VITE_BUILD_SHARING_URL
    sharableURL += await codec.compress(reducedBuildResult.value)

    if (sharableURL.length > 2048) {
      // 2048 is a hard limit for URL length on Azure Consumption tiers which is what is used to host the website
      // Cf. https://docs.microsoft.com/en-us/answers/questions/223022/azure-app-service-containers-max-url-length.html
      // Cf. https://github.com/MicrosoftDocs/azure-docs/blob/master/includes/api-management-service-limits.md
      return Result.fail(FailureType.warning, 'BuildService.toSharableString()', i18n.t('message.cannotShareBuildTooLarge', { name: build.name }))
    }

    return Result.ok(sharableURL)
  }

  /**
   * Updates a build.
   * @param id - ID of the build to update.
   * @param build - Updated version of the build.
   */
  public update(id: string, build: IBuild): Result {
    build.id = id
    const storageKey = this.getKey(id)

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key === storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(build))

        return Result.ok()
      }
    }

    return Result.fail(
      FailureType.warning,
      'BuildService.update()',
      i18n.t('message.buildNotFound', { id })
    )
  }

  /**
   * Gets a storage key.
   * @param id - Build id.
   * @returns Storage key.
   */
  private getKey(id: string): string {
    const key = Configuration.VITE_BUILD_KEY_PREFIX as string + id

    return key
  }

  /**
   * Parses an inventory item that was reduced for sharing.
   * @param serializedInventoryItem - Reduced inventory item.
   * @returns Inventory item.
   */
  private parseReducedInventoryItem(reducedInventoryItem: Record<string, unknown>): Result<IInventoryItem> {
    const itemId = reducedInventoryItem['i'] as string

    if (itemId === undefined) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryItem()', i18n.t('message.cannotParseInventoryItemWithoutItemId'))
    }

    const ignorePrice = reducedInventoryItem['p'] !== undefined
    let quantity = reducedInventoryItem['q'] as number

    if (quantity === undefined) {
      quantity = 1
    }

    const reducedContainedItems = reducedInventoryItem['c'] as Record<string, unknown>[]
    const containedItems: IInventoryItem[] = []

    if (reducedContainedItems !== undefined) {
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

    if (reducedModSlots !== undefined) {
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
   * Parses an inventory mod slot that was reduced for sharing.
   * @param serializedInventoryModSlot - Reduced inventory mod slot.
   * @returns Mod slot.
   */
  private parseReducedInventoryModSlot(reducedInventoryModSlot: Record<string, unknown>): Result<IInventoryModSlot> {
    const modSlotName = reducedInventoryModSlot['n'] as string

    if (modSlotName === undefined) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryModSlot()', i18n.t('message.cannotParseInventoryModSlotWithoutModSlotName'))
    }

    let inventoryItem: IInventoryItem | undefined = undefined
    const reducedItem = reducedInventoryModSlot['i'] as Record<string, unknown> | undefined

    if (reducedItem !== undefined) {
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
   * Parses an inventory slot that was reduced for sharing.
   * @param reducedInventorySlot - Reduced inventory slot.
   * @returns Inventory slot .
   */
  private parseReducedInventorySlot(reducedInventorySlot: Record<string, unknown>): Result<IInventorySlot> {
    const reducedItems = reducedInventorySlot['i'] as Record<string, unknown>[]

    if (reducedItems === undefined || reducedItems.length === 0) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', i18n.t('message.cannotParseInventorySlotWithoutItems'))
    }

    const typeId = reducedInventorySlot['t'] as string

    if (typeId === undefined) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', i18n.t('message.cannotParseInventorySlotWithoutTypeId'))
    }

    const inventoryItems: IInventoryItem[] = []

    for (const reducedItem of reducedItems) {
      const inventoryItemResult = this.parseReducedInventoryItem(reducedItem)

      if (!inventoryItemResult.success) {
        return Result.failFrom(inventoryItemResult)
      }

      inventoryItems.push(inventoryItemResult.value)
    }

    return Result.ok({
      items: inventoryItems,
      typeId
    })
  }

  /**
   * Transforms an inventory item in order to share it.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryItem - Inventory item.
   * @returns Reduced inventory item.
   */
  private reduceInventoryItemForSharing(inventoryItem: IInventoryItem): Record<string, unknown> {
    const reducedInventoryItem: Record<string, unknown> = {}
    const reducedContentainedItems: Record<string, unknown>[] = []
    const reducedModSlots: Record<string, unknown>[] = []

    reducedInventoryItem['i'] = inventoryItem.itemId

    if (inventoryItem.ignorePrice) {
      reducedInventoryItem['p'] = ''
    }

    if (inventoryItem.quantity > 1) {
      reducedInventoryItem['q'] = inventoryItem.quantity
    }

    for (const containedItem of inventoryItem.content) {
      const reducedContainedItem = this.reduceInventoryItemForSharing(containedItem)
      reducedContentainedItems.push(reducedContainedItem)
    }

    for (const modSlot of inventoryItem.modSlots.filter(ms => ms.item != undefined)) {
      const reducedModSlot = this.reduceInventoryModSlotForSharing(modSlot)
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
   * Transforms an inventory mod slot in order to share it.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryItem - Inventory mod slot.
   * @returns Reduced inventory mod slot.
   */
  private reduceInventoryModSlotForSharing(inventoryModSlot: IInventoryModSlot): Record<string, unknown> {
    const reducedInventoryModSlot: Record<string, unknown> = {}

    reducedInventoryModSlot['n'] = inventoryModSlot.modSlotName

    /* istanbul ignore else */
    if (inventoryModSlot.item != undefined) {
      // Should alway occur because we only call this method for mod slots containing an item
      reducedInventoryModSlot['i'] = this.reduceInventoryItemForSharing(inventoryModSlot.item)
    }

    return reducedInventoryModSlot
  }

  /**
   * Transforms an inventory slot in order to share it.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryItem - Inventory slot.
   * @returns Reduced inventory slot.
   */
  private reduceInventorySlotForSharing(inventorySlot: IInventorySlot): Record<string, unknown> {
    const reducedInventorySlot: Record<string, unknown> = {}
    const reducedInventoryItems: Record<string, unknown>[] = []

    reducedInventorySlot['t'] = inventorySlot.typeId

    for (const inventoryItem of inventorySlot.items) {
      if (inventoryItem == undefined) {
        continue
      }

      const reducedInventoryItem = this.reduceInventoryItemForSharing(inventoryItem)
      reducedInventoryItems.push(reducedInventoryItem)
    }

    reducedInventorySlot['i'] = reducedInventoryItems

    return reducedInventorySlot
  }
}
