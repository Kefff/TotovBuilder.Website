import { IBuild } from '../models/build/IBuild'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import vueI18n from '../plugins/vueI18n'

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
   * Checks if the path is a path to an armor in an armor inventory slot.
   * @param path - Path.
   * @returns true when the path is a path to an armor in an armor inventory slot; otherwise false.
   */
  public static checkIsArmorInventorySlotPath(path: string): boolean {
    const isArmorPath = path.includes(`${PathUtils.inventorySlotPrefix}${InventorySlotTypeId.bodyArmor}`)
    const contentSlotIndex = path.lastIndexOf(PathUtils.contentPrefix)
    const modSlotIndex = path.lastIndexOf(PathUtils.modSlotPrefix)

    return isArmorPath && contentSlotIndex < 0 && modSlotIndex < 0
  }

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
   * Checks if the path is a path to a vest in a vest inventory slot.
   * @param path - Path.
   * @returns true when the path is a path to a vest in a vest inventory slot; otherwise false.
   */
  public static checkIsVestInventorySlotPath(path: string): boolean {
    const isVestPath = path.includes(`${PathUtils.inventorySlotPrefix}${InventorySlotTypeId.tacticalRig}`)
    const contentSlotIndex = path.lastIndexOf(PathUtils.contentPrefix)
    const modSlotIndex = path.lastIndexOf(PathUtils.modSlotPrefix)

    return isVestPath && contentSlotIndex < 0 && modSlotIndex < 0
  }

  /**
   * Gets and inventory item of a build from a path.
   * @param build - Build.
   * @param path - Path.
   * @returns Inventory item.
   */
  public static getInventoryItemFromPath(build: IBuild, path: string): IInventoryItem {
    const inventorySlotItem = this.getInventorySlotItem(build, path)
    const inventoryItem = this.getInventoryItem(inventorySlotItem, path, 3)

    return inventoryItem
  }

  /**
   * Gets the mod slot names present in a path.
   * @param path - Path.
   */
  public static getPathModSlotNames(path: string): string[] {
    const modSlotNames: string[] = []
    const regex = new RegExp(/mod:([a-z0-9_]+)\/?/g)
    const matches = path.matchAll(regex)

    if (matches != null) {
      for (const match of matches) {
        modSlotNames.push(match[1])
      }
    }

    return modSlotNames
  }

  /**
   * Gets an inventory item by recursively searching into an inventory item while going through a path.
   * @param currentInventoryItem - Current inventory item.
   * @param path - Path.
   * @param currentPathArrayIndex - Index of the current element of the path.
   * @returns Inventory item.
   */
  private static getInventoryItem(currentInventoryItem: IInventoryItem, path: string, currentPathArrayIndex: number): IInventoryItem {
    const pathArray = path.split('/')

    if (pathArray.length === currentPathArrayIndex) {
      return currentInventoryItem
    }

    if (pathArray[currentPathArrayIndex].startsWith(PathUtils.modSlotPrefix)) {
      const modSlot = currentInventoryItem.modSlots.find(ms => ms.modSlotName === pathArray[currentPathArrayIndex].replace(PathUtils.modSlotPrefix, ''))

      currentPathArrayIndex++
      const expectedItemId = pathArray[currentPathArrayIndex]?.replace(PathUtils.itemPrefix, '')

      if (modSlot?.item == null || modSlot.item.itemId !== expectedItemId) {
        throw new Error(vueI18n.t('message.cannotFindModSlotItemInPath', { path, itemId: expectedItemId }))
      }

      currentInventoryItem = modSlot.item
    } else if (pathArray[currentPathArrayIndex].startsWith(PathUtils.contentPrefix)) {
      let contentIndexString = pathArray[currentPathArrayIndex].replace(PathUtils.contentPrefix, '')
      contentIndexString = contentIndexString.slice(0, contentIndexString.indexOf('_'))
      const contentIndex = Number(contentIndexString)

      currentPathArrayIndex++
      const expectedItemId = pathArray[currentPathArrayIndex]?.replace(PathUtils.itemPrefix, '')

      if (isNaN(contentIndex) || currentInventoryItem.content[contentIndex].itemId !== expectedItemId) {
        throw new Error(vueI18n.t('message.cannotFindContentItemInPath', { path, itemId: expectedItemId }))
      }

      currentInventoryItem = currentInventoryItem.content[Number(contentIndex)]
    } else {
      throw new Error(vueI18n.t('message.invalidPath', { path }))
    }

    currentPathArrayIndex++
    const inventoryItem = this.getInventoryItem(currentInventoryItem, path, currentPathArrayIndex)

    return inventoryItem
  }

  /**
   * Gets the inventory item of a slot of a build from on a path.
   * @param build - Build.
   * @param path - Path.
   * @returns Inventory item.
   */
  private static getInventorySlotItem(build: IBuild, path: string): IInventoryItem {
    const pathArray = path.split('/')
    const inventorySlotInfo = pathArray.find(p => p.startsWith(this.inventorySlotPrefix))

    if (inventorySlotInfo == null) {
      throw new Error(vueI18n.t('message.cannotFindInventorySlotInPath', { path }))
    }

    const inventorySlotAndIndex = inventorySlotInfo.replace(this.inventorySlotPrefix, '').split('_')
    const inventorySlot = build.inventorySlots.find(is => is.typeId === inventorySlotAndIndex[0])

    if (inventorySlot == null) {
      throw new Error(vueI18n.t('message.cannotFindInventorySlot', { inventorySlotTypeId: inventorySlotAndIndex[0] }))
    }

    const inventoryItemIndex = Number(inventorySlotAndIndex[1])
    const inventoryItem = inventorySlot.items[inventoryItemIndex]

    if (inventoryItem == null) {
      throw new Error(vueI18n.t('message.cannotFindInventoryItemInInventorySlot', { inventorySlotTypeId: inventorySlotAndIndex[0], index: inventoryItemIndex }))
    }

    return inventoryItem
  }
}