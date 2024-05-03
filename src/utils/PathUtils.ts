import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import vueI18n from '../plugins/vueI18n'
import { LogService } from '../services/LogService'
import Services from '../services/repository/Services'

/**
 * Represents an utility class for managing build paths.
 */
export class PathUtils {
  public static buildPrefix = 'build:'
  public static contentPrefix = 'content:'
  public static itemPrefix = 'item:'
  public static inventorySlotPrefix = 'slot:'
  public static modSlotPrefix = 'mod:'
  public static newBuild = 'new-build'

  /**
   * Checks if the path is a path to a mod slot.
   * @param path - Path.
   * @returns true when the path is a path to a mod slot; otherwise false.
   */
  public static checkIsModSlotPath(path: string): boolean {
    const lastModSlotIndex = path.lastIndexOf(PathUtils.modSlotPrefix)
    const lastContentSlotIndex = path.lastIndexOf(PathUtils.contentPrefix)

    return lastModSlotIndex >= 0 && lastModSlotIndex > lastContentSlotIndex
  }

  /**
   * Gets and inventory item of a build from a path.
   * @param build - Build.
   * @param path - Path.
   * @returns Inventory item.
   */
  public static getInventoryItemFromPath(build: IBuild, path: string): IInventoryItem | undefined {
    const inventorySlotItem = this.getInventorySlotItem(build, path)

    if (inventorySlotItem == null) {
      return undefined
    }

    return this.getInventoryItem(inventorySlotItem, path, 3)
  }

  /**
   * Gets an inventory item by recursively searching into an inventory item while going through a path.
   * @param currentInventoryItem - Current inventory item.
   * @param path - Path.
   * @param currentPathArrayIndex - Index of the current element of the path.
   * @returns Inventory item.
   */
  private static getInventoryItem(currentInventoryItem: IInventoryItem, path: string, currentPathArrayIndex: number): IInventoryItem | undefined {
    const logService = Services.get(LogService)
    const pathArray = path.split('/')

    if (pathArray.length === currentPathArrayIndex) {
      return currentInventoryItem
    }

    if (pathArray[currentPathArrayIndex].startsWith(PathUtils.modSlotPrefix)) {
      const modSlot = currentInventoryItem.modSlots.find(ms => ms.modSlotName === pathArray[currentPathArrayIndex].replace(PathUtils.modSlotPrefix, ''))

      currentPathArrayIndex++
      const expectedItemId = pathArray[currentPathArrayIndex]?.replace(PathUtils.itemPrefix, '')

      if (modSlot?.item == null || modSlot.item.itemId !== expectedItemId) {
        logService.logError(vueI18n.t('message.cannotFindModSlotItemInPath', { path, itemId: expectedItemId }))

        return undefined
      }

      currentInventoryItem = modSlot.item
    } else if (pathArray[currentPathArrayIndex].startsWith(PathUtils.contentPrefix)) {
      let contentIndexString = pathArray[currentPathArrayIndex].replace(PathUtils.contentPrefix, '')
      contentIndexString = contentIndexString.slice(0, contentIndexString.indexOf('_'))
      const contentIndex = Number(contentIndexString)

      currentPathArrayIndex++
      const expectedItemId = pathArray[currentPathArrayIndex]?.replace(PathUtils.itemPrefix, '')

      if (isNaN(contentIndex) || currentInventoryItem.content[contentIndex].itemId !== expectedItemId) {
        logService.logError(vueI18n.t('message.cannotFindContentItemInPath', { path, itemId: expectedItemId }))

        return undefined
      }

      currentInventoryItem = currentInventoryItem.content[Number(contentIndex)]
    } else {
      logService.logError(vueI18n.t('message.invalidPath', { path }))

      return undefined
    }

    currentPathArrayIndex++

    return this.getInventoryItem(currentInventoryItem, path, currentPathArrayIndex)
  }

  /**
   * Gets the inventory item of a slot of a build base on a path.
   * @param build - Build.
   * @param path - Path.
   * @returns Inventory item.
   */
  private static getInventorySlotItem(build: IBuild, path: string): IInventoryItem | undefined {
    const logService = Services.get(LogService)
    const pathArray = path.split('/')
    const inventorySlotInfo = pathArray.find(p => p.startsWith(this.inventorySlotPrefix))

    if (inventorySlotInfo == null) {
      logService.logError(vueI18n.t('message.cannotFindInventorySlotInPath', { path }))

      return undefined
    }

    const inventorySlotAndIndex = inventorySlotInfo.replace(this.inventorySlotPrefix, '').split('_')
    const inventorySlot = build.inventorySlots.find(is => is.typeId === inventorySlotAndIndex[0])

    if (inventorySlot == null) {
      logService.logError(vueI18n.t('message.cannotFindInventorySlot', { inventorySlotTypeId: inventorySlotAndIndex[0] }))

      return undefined
    }

    const inventoryItemIndex = Number(inventorySlotAndIndex[1])
    const inventoryItem = inventorySlot.items[inventoryItemIndex]

    if (inventoryItem == null) {
      logService.logError(vueI18n.t('message.cannotFindInventoryItemInInventorySlot', { inventorySlotTypeId: inventorySlotAndIndex[0], index: inventoryItemIndex }))

      return undefined
    }

    return inventoryItem
  }
}