import { Guid } from 'guid-typescript'
import jsonUrl from 'json-url'
import InventorySlotTypes from '../data/inventory-slot-types.json'
import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { ReductionService } from './ReductionService'
import { VersionService } from './VersionService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

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
   * @param ignoreDefaultSlotItems - Indicates whether the default items of inventory slots are ignored.
   * @returns New build.
   */
  public create(ignoreDefaultSlotItems: boolean = false): IBuild {
    const newBuild: IBuild = {
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined
    }

    for (const inventorySlotType of InventorySlotTypes.sort((inventorySlotType1, inventorySlotType2) => inventorySlotType1.displayOrder - inventorySlotType2.displayOrder)) {
      const items: (IInventoryItem | undefined)[] = []

      for (let i = 0; i < inventorySlotType.itemSlotsAmount; i++) {
        items.push(undefined)
      }

      if (!ignoreDefaultSlotItems) {
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
      return Result.fail(FailureType.error, 'BuildService.fromSharableString()', vueI18n.t('message.invalidSharableString'))
    }

    const buildResult = Services.get(ReductionService).parseReducedBuild(reducedBuild)

    if (!buildResult.success) {
      return Result.fail(FailureType.error, 'BuildService.fromSharableString()', vueI18n.t('message.invalidSharableString'))
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
        vueI18n.t('message.buildNotFound', { id })
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
      if (build.lastExported != null) {
        build.lastExported = new Date(build.lastExported as unknown as string)
      }

      if (build.lastUpdated != null) {
        build.lastUpdated = new Date(build.lastUpdated as unknown as string)
      }
    } catch {
      return Result.fail(FailureType.error, 'BuildService.parse()', vueI18n.t('message.buildParsingError', { id }))
    }

    return Result.ok(build)
  }

  /**
   * Converts a build to an encoded URL that can be shared.
   * @param build - Build.
   * @returns Encoded URL.
   */
  public async toSharableURL(build: IBuild): Promise<Result<string>> {
    // Reducing the size of the build
    const reducedBuild = Services.get(ReductionService).reduceBuild(build)

    // Compressing the build into a URL
    const codec = jsonUrl('lzma')
    let sharableURL = window.location.origin + '/' + Services.get(WebsiteConfigurationService).configuration.buildSharingUrl
    sharableURL += await codec.compress(reducedBuild)

    if (sharableURL.length > 2048) {
      // 2048 is a hard limit for URL length on Azure Consumption tiers which is what is used to host the website
      // Cf. https://docs.microsoft.com/en-us/answers/questions/223022/azure-app-service-containers-max-url-length.html
      // Cf. https://github.com/MicrosoftDocs/azure-docs/blob/master/includes/api-management-service-limits.md
      return Result.fail(FailureType.warning, 'BuildService.toSharableString()', vueI18n.t('message.cannotShareBuildTooLarge', { name: build.name }))
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
      vueI18n.t('message.buildNotFound', { id })
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
}
