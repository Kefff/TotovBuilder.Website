import { IBuildItemWithPath } from '../models/build/IBuildItemWithPath'
import { IHeadwear } from '../models/item/IHeadwear'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IVest } from '../models/item/IVest'
import vuei18n from '../plugins/vueI18n'
import { PathUtils } from './PathUtils'

/**
 * Represents a utility methods for checking the compatibility between items in a build.
 */
export class CompatibilityUtils {
  /**
   * Check the compatibility between an item to add in a build and the items already present in the build.
   * @param buildItemPaths - List of the items in the build and their path.
   * @param itemToAddPath - Path of the item to add in the build.
   * @param itemToAdd - Item to add in the build.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  public static checkCompatibility(buildItemPaths: IBuildItemWithPath[], itemToAddPath: string, itemToAdd: IItem): string | undefined {
    if (PathUtils.checkIsInventorySlotItem(itemToAddPath)) {
      for (const buildItemPath of buildItemPaths) {
        const isBuildItemInInventorySlot = PathUtils.checkIsInventorySlotItem(buildItemPath.path)

        if (!isBuildItemInInventorySlot) {
          continue
        }

        let conflictReason = this.checkArmorVestConflict(buildItemPath.item, itemToAdd)

        if (conflictReason != null) {
          return conflictReason
        }

        conflictReason = this.checkHeadwearEarpieceConflict(buildItemPath.item, itemToAdd)

        if (conflictReason != null) {
          return conflictReason
        }

        conflictReason = this.checkConflict(buildItemPath.item, itemToAdd)

        if (conflictReason != null) {
          return conflictReason
        }
      }
    } else if (PathUtils.checkIsModSlotPath(itemToAddPath)) {
      const moddedItemId = PathUtils.getModdedItemIdFromPath(itemToAddPath)

      for (const buildItemPath of buildItemPaths) {
        const isBuildItemModSlotPath = PathUtils.checkIsModSlotPath(buildItemPath.path)

        if (!isBuildItemModSlotPath) {
          continue
        }

        const buildItemModdedItemId = PathUtils.getModdedItemIdFromPath(buildItemPath.path)

        if (moddedItemId !== buildItemModdedItemId) {
          continue
        }

        const conflictReason = this.checkConflict(buildItemPath.item, itemToAdd)

        if (conflictReason != null) {
          return conflictReason
        }
      }
    }
  }

  /**
   * Checks whether two items are conflicting whith each other.
   * @param item1 - First item.
   * @param item2 - Second item.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private static checkConflict(item1: IItem, item2: IItem): string | undefined {
    let conflictReason: string | undefined = undefined

    if (item1.conflictingItemIds.includes(item2.id)) {
      conflictReason = vuei18n.t('message.cannotAddConflictingItem', { conflictingItemName: item1.name })
    } else if (item2.conflictingItemIds.includes(item1.id)) {
      conflictReason = vuei18n.t('message.cannotAddConflictingItem', { conflictingItemName: item2.name })
    }

    return conflictReason
  }

  /**
   * Checks whether an armor and a vest with armor are conflicting.
   * @param itemInBuild - Item in the build.
   * @param itemToAdd - Item to add in the build.
   * @returns Reason of the restriction; otherwise `undefined`.
   */
  private static checkArmorVestConflict(itemInBuild: IItem, itemToAdd: IItem): string | undefined {
    let conflictReason: string | undefined = undefined

    if (itemInBuild.categoryId === ItemCategoryId.armor
      && itemToAdd.categoryId === ItemCategoryId.vest
      && (itemToAdd as IVest).armoredAreas.length > 0) {
      conflictReason = vuei18n.t('message.cannotAddTacticalRig')
    } else if (itemInBuild.categoryId === ItemCategoryId.vest
      && (itemInBuild as IVest).armoredAreas.length > 0
      && itemToAdd.categoryId === ItemCategoryId.armor) {
      conflictReason = vuei18n.t('message.cannotAddBodyArmor')
    }

    return conflictReason
  }

  /**
   * Checks whether headwear and earpiece are conflicting.
   * @param itemInBuild - Item in the build.
   * @param itemToAdd - Item to add in the build.
   * @returns Reason of the restriction one of the two items restrics the other; otherwise `undefined`.
   */
  private static checkHeadwearEarpieceConflict(itemInBuild: IItem, itemToAdd: IItem): string | undefined {
    let conflictReason: string | undefined = undefined

    if (itemInBuild.categoryId === ItemCategoryId.headwear
      && (itemInBuild as IHeadwear).blocksHeadphones
      && itemToAdd.categoryId === ItemCategoryId.headphones) {
      conflictReason = vuei18n.t('message.cannotAddEarpiece')
    } else if (itemToAdd.categoryId === ItemCategoryId.headwear
      && (itemToAdd as IHeadwear).blocksHeadphones
      && itemInBuild.categoryId === ItemCategoryId.headphones) {
      conflictReason = vuei18n.t('message.cannotAddHelmet')
    }

    return conflictReason
  }
}