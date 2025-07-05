import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'

/**
 * Represents an utility class for managing build paths.
 */
export class PathUtils {
  public static baseItemPrefix = 'base-item:'
  public static buildPrefix = 'build:'
  public static contentPrefix = 'content:'
  public static itemPrefix = 'item:'
  public static inventorySlotPrefix = 'slot:'
  public static modSlotPrefix = 'mod:'
  public static newBuild = 'new-build'

  /**
   * Checks if the path is a path to an inventory slot item.
   * @param path - Path.
   * @returns `true` when the path is a path to an item in an inventory slot; otherwise `false`.
   */
  public static checkIsInventorySlotItem(path: string, inventorySlotType?: InventorySlotTypeId): boolean {
    const contentSlotIndex = path.lastIndexOf(PathUtils.contentPrefix)

    if (contentSlotIndex >= 0) {
      return false
    }

    const modSlotIndex = path.lastIndexOf(PathUtils.modSlotPrefix)

    if (modSlotIndex >= 0) {
      return false
    }

    const baseItemSlotIndex = path.lastIndexOf(PathUtils.baseItemPrefix)

    if (baseItemSlotIndex >= 0) {
      return false
    }

    if (inventorySlotType != null && !path.includes(`${PathUtils.inventorySlotPrefix}${inventorySlotType}`)) {
      return false
    }

    return true
  }

  /**
   * Checks if the path is a path to a mod slot.
   * @param path - Path.
   * @returns `true` when the path is a path to a mod slot; otherwise `false`.
   */
  public static checkIsModSlotPath(path: string): boolean {
    const lastModSlotIndex = path.lastIndexOf(PathUtils.modSlotPrefix)
    const lastContentSlotIndex = path.lastIndexOf(PathUtils.contentPrefix)

    return lastModSlotIndex >= 0 && lastModSlotIndex > lastContentSlotIndex
  }

  /**
   * Gets the path of a base item.
   * @param itemPath - Path of the item the base item belongs to.
   * @param baseItemId - ID of the base item.
   * @returns Path of the base item.
   */
  public static getBaseItemPath(itemPath: string, baseItemId: string): string {
    const path = `${itemPath}/${PathUtils.baseItemPrefix}/${PathUtils.itemPrefix}${baseItemId}`

    return path
  }

  /**
   * Gets the path of a build.
   * @param builId - Build.
   * @param isNewBuild - Indicates whether the build is a new build.
   * @returns Path of the build.
   */
  public static getBuildPath(builId: string, isNewBuild: boolean): string {
    const path = PathUtils.buildPrefix + (isNewBuild ? PathUtils.newBuild : builId)

    return path
  }

  /**
   * Gets the path of an item in the content of another item.
   * @param itemPath - Path of the container item.
   * @param contentIndex - Index of the contained item.
   * @param contentLength - Length of the content of the container item.
   * @param containedItemId - Contained item ID.
   * @returns Path of the contained item.
   */
  public static getContainedItemPath(itemPath: string, contentIndex: number, contentLength: number, containedItemId: string): string {
    const path = `${itemPath}/${PathUtils.contentPrefix}${contentIndex}_${contentLength}/${PathUtils.itemPrefix}${containedItemId}`

    return path
  }

  /**
   * Gets the path of an item in an inventory slot.
   * @param inventorySlotPath - Inventory slot path.
   * @param itemIndex - Index of the item in the inventory slot.
   * @param itemId - ID of the item.
   * @returns Path of the item in the inventory slot.
   */
  public static getInventorySlotItemPath(inventorySlotPath: string, itemIndex: number, itemId: string | undefined): string {
    const path = this.getItemPath(`${inventorySlotPath}_${itemIndex}`, itemId)

    return path
  }

  /**
   * Gets the path of an inventory slot.
   * @param builPath - Path of the build.
   * @param inventorySlotTypeId - Inventory slot type.
   * @returns Path of the inventory slot.
   */
  public static getInventorySlotPath(builPath: string, inventorySlotTypeId: InventorySlotTypeId): string {
    const path = `${builPath}/${PathUtils.inventorySlotPrefix}${inventorySlotTypeId}`

    return path
  }

  /**
   * Gets the path of a item.
   * @param previousPath - Previous path.
   * @param itemId - Item ID.
   * @returns Path of the item.
   */
  public static getItemPath(previousPath: string, itemId: string | undefined): string {
    const path = `${previousPath}/${PathUtils.itemPrefix}${itemId ?? 'empty'}`

    return path
  }

  /**
   * Gets the ID of the item being modded in a path.
   * This can either be the item of the inventory slot or an item in the content of another item.
   * @param path - Path.
   * @returns ID of the item being modded or `undefined` if there are none.
   */
  public static getModdedItemIdFromPath(path: string): string | undefined {
    const pathArray = path.split('/')
    let lastItemId: string | undefined = undefined

    for (let i = pathArray.length - 1; i >= 0; i--) {
      const pathPart = pathArray[i]

      if (pathPart.startsWith(this.itemPrefix)) {
        if (i < pathArray.length - 1) {
          // We ignore the last item of the path
          lastItemId = pathPart.replace(this.itemPrefix, '')
        }
      } else if (pathPart.startsWith(this.modSlotPrefix)) {
        continue
      } else if (pathPart.startsWith(this.contentPrefix) || pathPart.startsWith(this.inventorySlotPrefix)) {
        return lastItemId
      } else {
        break
      }
    }

    return undefined
  }

  /**
   * Gets the path of a mod slot.
   * @param itemPath - Path of the item the mod slot belongs to.
   * @param modSlotName - Name of the mod slot.
   */
  public static getModSlotPath(itemPath: string, modSlotName: string): string {
    const path = `${itemPath}/${PathUtils.modSlotPrefix}${modSlotName}`

    return path
  }

  /**
   * Gets the level of imbrication of the path of an item.
   * @param path - Path of an item.
   * @returns Level of imbrication.
   */
  public static getPathLevel(path: string): number {
    const itemPrefixString = `/${PathUtils.itemPrefix}`
    let itemOccurences = 0
    let index = path.indexOf(itemPrefixString)

    while (index !== -1) {
      itemOccurences++
      index = path.indexOf(itemPrefixString, index + itemPrefixString.length)
    }

    return itemOccurences - 1
  }
}