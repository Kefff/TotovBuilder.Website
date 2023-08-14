import { Guid } from 'guid-typescript'
import { IBuild } from '../models/build/IBuild'
import Result, { FailureType } from '../utils/Result'
import InventorySlotTypes from '../assets/data/inventory-slot-types.json'
import { IInventoryItem } from '../models/build/IInventoryItem'
import i18n from '../plugins/vueI18n'
import jsonUrl from 'json-url'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IInventorySlot } from '../models/build/IInventorySlot'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { VersionService } from './VersionService'

/**
 * Represents a service responsible for managing builds.
 */
export class BuildService {
  /**
   * Adds build.
   * @param build - Build to add.
   * @returns Build ID.
   */
  public async add(build: IBuild): Promise<string> {
    build.id = Guid.create().toString()
    build.lastWebsiteVersion = await Services.get(VersionService).getVersion()

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
      lastUpdated: undefined,
      lastWebsiteVersion: undefined
    }

    for (const inventorySlotType of InventorySlotTypes.sort((inventorySlotType1, inventorySlotType2) => inventorySlotType1.displayOrder - inventorySlotType2.displayOrder)) {
      const items = new Array<IInventoryItem>(inventorySlotType.itemSlotsAmount)

      if (inventorySlotType.defaultItemsIds != null) {
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

    Services.get(VersionService).executeBuildMigrations(buildResult.value) // Executing migrations on the build in case it is obsolete

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

    if (serializedBuild === null) {
      return Result.fail<IBuild>(
        FailureType.error,
        'BuildService.update()',
        i18n.t('message.buildNotFound', { id })
      )
    }

    const buildResult = this.parse(id, serializedBuild)

    if (buildResult.success) {
      return Result.ok(buildResult.value)
    } else {
      return Result.failFrom(buildResult)
    }
  }

  /**
   * Gets all builds.
   * @returns All builds.
   */
  public getAll(): IBuild[] {
    const builds: IBuild[] = []
    const buildKeyPrefix = Services.get(WebsiteConfigurationService).configuration.buildStorageKeyPrefix

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) // Key could potentially be null if a build is deleted while looping, but it is hardly testable

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
   * Parses a serialized build.
   * @param id - ID of the build.
   * @param serializedBuild - Serialized build.
   * @returns Parsed build.
   */
  public parse(id: string, serializedBuild: string): Result<IBuild> {
    let build: IBuild

    try {
      build = JSON.parse(serializedBuild) as IBuild

      // Converting dates back to Date type
      build.lastUpdated = new Date(build.lastUpdated as unknown as string)

      if (build.lastExported != null) {
        build.lastExported = new Date(build.lastExported as unknown as string)
      }
    } catch {
      return Result.fail(FailureType.error, 'BuildService.parse()', i18n.t('message.buildParsingError', { id }))
    }

    return Result.ok(build)
  }

  /**
   * Parses a build that was reduced for sharing.
   * @param reducedBuild - Serialized build.
   * @returns Build.
   */
  public parseReducedBuild(reducedBuild: Record<string, unknown>): Result<IBuild> {
    const reducedInventorySlots = reducedBuild['s'] as Record<string, unknown>[]

    if (reducedInventorySlots == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedBuild()', i18n.t('message.cannotParseBuildWithoutInventorySlots'))
    }

    const build = this.create()

    for (const reducedInventorySlot of reducedInventorySlots) {
      const inventorySlotResult = this.parseReducedInventorySlot(reducedInventorySlot)

      if (!inventorySlotResult.success) {
        return Result.failFrom(inventorySlotResult)
      }

      const index = build.inventorySlots.findIndex(is => is.typeId === inventorySlotResult.value.typeId)
      build.inventorySlots[index] = inventorySlotResult.value
    }

    return Result.ok(build)
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
   * Converts a build to an encoded URL that can be shared.
   * @param build - Build.
   * @returns Encoded URL.
   */
  public async toSharableURL(build: IBuild): Promise<Result<string>> {
    // Reducing the size of the build
    const reducedBuild = this.reduceBuild(build)

    // Compressing the build into a URL
    const codec = jsonUrl('lzma')
    let sharableURL = Services.get(WebsiteConfigurationService).configuration.buildSharingUrl
    sharableURL += await codec.compress(reducedBuild)

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
  public async update(id: string, build: IBuild): Promise<Result> {
    build.id = id
    build.lastUpdated = new Date()
    build.lastWebsiteVersion = await Services.get(VersionService).getVersion()

    const storageKey = this.getKey(id)

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key === storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(build))

        return Result.ok()
      }
    }

    return Result.fail(
      FailureType.error,
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
    const key = Services.get(WebsiteConfigurationService).configuration.buildStorageKeyPrefix + id

    return key
  }

  /**
   * Parses an inventory item that was reduced for sharing.
   * @param reducedInventoryItem - Reduced inventory item.
   * @returns Inventory item.
   */
  private parseReducedInventoryItem(reducedInventoryItem: Record<string, unknown>): Result<IInventoryItem> {
    const itemId = reducedInventoryItem['i'] as string

    if (itemId == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryItem()', i18n.t('message.cannotParseInventoryItemWithoutItemId'))
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
   * Parses an inventory mod slot that was reduced for sharing.
   * @param reducedInventoryModSlot - Reduced inventory mod slot.
   * @returns Mod slot.
   */
  private parseReducedInventoryModSlot(reducedInventoryModSlot: Record<string, unknown>): Result<IInventoryModSlot> {
    const modSlotName = reducedInventoryModSlot['n'] as string

    if (modSlotName == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventoryModSlot()', i18n.t('message.cannotParseInventoryModSlotWithoutModSlotName'))
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
   * Parses an inventory slot that was reduced for sharing.
   * @param reducedInventorySlot - Reduced inventory slot.
   * @returns Inventory slot .
   */
  private parseReducedInventorySlot(reducedInventorySlot: Record<string, unknown>): Result<IInventorySlot> {
    const reducedItems = reducedInventorySlot['i'] as Record<string, unknown>[]

    if (reducedItems == null || reducedItems.length === 0) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', i18n.t('message.cannotParseInventorySlotWithoutItems'))
    }

    const typeId = reducedInventorySlot['t'] as string

    if (typeId == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', i18n.t('message.cannotParseInventorySlotWithoutTypeId'))
    }

    const inventorySlotType = InventorySlotTypes.find(ist => ist.id === typeId)

    if (inventorySlotType == null) {
      return Result.fail(FailureType.error, 'BuildService.parseReducedInventorySlot()', i18n.t('message.cannotFindInventorySlotType', { inventorySlotTypeId: typeId }))
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
   * Transforms an inventory item so it takes less place.
   * Unnecessary data is scrapped and property names are shortened.
   * @param inventoryItem - Inventory item.
   * @returns Reduced inventory item.
   */
  private reduceInventoryItem(inventoryItem: IInventoryItem): Record<string, unknown> {
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
