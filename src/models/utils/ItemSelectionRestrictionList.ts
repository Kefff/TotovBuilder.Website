import vuei18n from '../../plugins/vueI18n'
import { PathUtils } from '../../utils/PathUtils'
import { IBuild } from '../build/IBuild'
import { InventorySlotTypeId } from '../build/InventorySlotTypes'
import { IHeadwear } from '../item/IHeadwear'
import { IItem } from '../item/IItem'
import { IVest } from '../item/IVest'
import { IItemSelectionRestriction } from './IItemSelectionRestriction'

/**
 * Represents a list of item selection restrictions.
 */
export class ItemSelectionRestrictionList {
  /**
   * Restrictions.
   */
  public get restrictions(): IItemSelectionRestriction[] {
    return this._restrictions
  }
  private _restrictions: IItemSelectionRestriction[] = []

  /**
   * Adds restrictions for an item if this item has restrictions.
   * @param build - Build.
   * @param path - Path of the item that adds restrictions.
   * @param item - Item that adds restrictions.
   */
  public add(build: IBuild, path: string, item: IItem): void {
    let hasAddedRestrictions = false

    hasAddedRestrictions = this.addArmorRestrictions(path, item)

    if (!hasAddedRestrictions) {
      hasAddedRestrictions = this.addHeadwearRestrictions(path, item)
    }

    if (!hasAddedRestrictions) {
      hasAddedRestrictions = this.addVestRestrictions(path, item)
    }

    if (!hasAddedRestrictions) {
      hasAddedRestrictions = this.addModRestrictions(build, path, item)
    }
  }

  /**
   * Removes the restrictions of an item.
   * All other restrictions with a path starting with the path are also removed.
   * @param path - Path of the item whose restrictions need to be removed.
   */
  public remove(path: string): void {
    this._restrictions = this._restrictions.filter(r => !r.path.startsWith(path))
  }

  /**
   * Replaces the restrictions of an item by the restrictions of a new item.
   * If there was no previous restrictions corresponding to the old path, new restrictions are added if necessary.
   * All other restrictions with a path starting with the old path are updated to start with the new path.
   * @param build - Build.
   * @param oldPath - Path of the previous item that added restrictions.
   * @param newPath - Path of the new item that adds restrictions.
   * @param item - New item that adds restrictions.
   */
  public update(build: IBuild, oldPath: string, newPath: string, item: IItem): void {
    const oldRestrictionIndex = this._restrictions.findIndex(r => r.path === oldPath)

    if (oldRestrictionIndex >= 0) {
      this._restrictions.splice(oldRestrictionIndex, 1)
    }

    this.add(build, newPath, item)

    for (const restriction of this._restrictions.filter(r => r.path.startsWith(oldPath))) {
      restriction.path = restriction.path.replace(oldPath, newPath)
    }
  }

  /**
   * Adds restrictions related to wearing an armor.
   * @param path - Path of the armor that adds restrictions.
   * @param armor - Armor that adds restrictions.
   * @returns - `true` if the armor has added restrictions; otherwise `false`.
   */
  private addArmorRestrictions(path: string, armor: IItem): boolean {
    const isArmorInventorySlotItem = PathUtils.checkIsInventorySlotItem(path, InventorySlotTypeId.bodyArmor)

    if (!isArmorInventorySlotItem) {
      return false
    }

    this._restrictions.push({
      checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByArmor(armor, itcp, itc),
      item: armor,
      path
    })

    return true
  }

  /**
   * Adds restrictions related to wearing headwear.
   * @param path - Path of the headwear that adds restrictions.
   * @param headwear - Headwear that adds restrictions.
   * @returns - `true` if the headwear has added restrictions; otherwise `false`.
   */
  private addHeadwearRestrictions(path: string, headwear: IItem): boolean {
    const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(path, InventorySlotTypeId.headwear)

    if (!isInventorySlotItem) {
      return false
    }

    const inventorySlotTypeId = InventorySlotTypeId.headwear // TODO

    if (inventorySlotTypeId !== InventorySlotTypeId.headwear) {
      return false
    }

    if (headwear.conflictingItemIds.length > 0 || (headwear as IHeadwear).blocksHeadphones) {
      this._restrictions.push({
        checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByHeadwear(headwear, itcp, itc),
        item: headwear,
        path
      })
    }

    return true
  }

  /**
   * Adds restrictions related to a mod in a modslot.
   * @param build - Build.
   * @param path - Path of the mod that adds restrictions.
   * @param mod - Mod that adds restrictions.
   * @returns - `true` if the mod has added restrictions; otherwise `false`.
   */
  private addModRestrictions(build: IBuild, path: string, mod: IItem): boolean {
    const isModSlotItem = PathUtils.checkIsModSlotPath(path)

    if (!isModSlotItem) {
      return false
    }

    const moddedItemId = PathUtils.getInventoryItemFromPath(build, path).itemId

    if (mod.conflictingItemIds.length > 0) {
      this._restrictions.push({
        checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByMod(build, mod, moddedItemId, itcp, itc),
        item: mod,
        path
      })
    }

    return true
  }

  /**
   * Adds restrictions related to wearing a vest.
   * @param path - Path of the vest that adds restrictions.
   * @param vest - Vest.
   * @returns - `true` if the vest has added restrictions; otherwise `false`.
   */
  private addVestRestrictions(path: string, vest: IItem): boolean {
    const isVestInventorySlotItem = PathUtils.checkIsInventorySlotItem(path, InventorySlotTypeId.tacticalRig)

    if (!isVestInventorySlotItem) {
      return false
    }

    const hasArmor = (vest as IVest).armoredAreas.length > 0

    if (!hasArmor) {
      return false
    }

    this._restrictions.push({
      checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByVest(vest, itcp, itc),
      item: vest,
      path
    })

    return true
  }

  /**
   * Checks whether two items are conflicting whith each other.
   * @param item1 - First item.
   * @param item2 - Second item.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsConflicting(item1: IItem, item2: IItem): string | undefined {
    const isConflicting = (item1.conflictingItemIds.includes(item2.id)
      || item2.conflictingItemIds.includes(item1.id))

    return isConflicting
      ? vuei18n.t('message.cannotAddConflictingItem', { conflictingItemName: item1.name })
      : undefined
  }

  /**
   * Checks whether an item is restricted because of an armor.
   * @param armor - Armor that adds restrictions.
   * @param itemToCheckPath - Path of the item to check.
   * @param itemToCheck - Item to check.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsRestrictedByArmor(armor: IItem, itemToCheckPath: string, itemToCheck: IItem): string | undefined {
    const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath)

    if (!isInventorySlotItem) {
      return undefined
    }

    const inventorySlotTypeId = InventorySlotTypeId.tacticalRig // TODO

    if (inventorySlotTypeId === InventorySlotTypeId.tacticalRig
      && (itemToCheck as IVest).armoredAreas.length > 0) {
      return vuei18n.t('message.cannotAddTacticalRig')
    }

    return this.checkIsConflicting(armor, itemToCheck)
  }

  /**
   * Checks whether an item is restricted because of headwear.
   * @param headwear - Headwear that adds restrictions.
   * @param itemToCheckPath - Path of the item to check.
   * @param itemToCheck - Item to check.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsRestrictedByHeadwear(headwear: IItem, itemToCheckPath: string, itemToCheck: IItem): string | undefined {
    const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath)

    if (!isInventorySlotItem) {
      return undefined
    }

    const inventorySlotType = InventorySlotTypeId.earpiece // TODO

    if (inventorySlotType === InventorySlotTypeId.earpiece) {
      return vuei18n.t('message.cannotAddEarpiece', { conflictingItemName: headwear.name })
    }

    return this.checkIsConflicting(headwear, itemToCheck)
  }

  /**
   * Checks whether an item is restricted because of a mod.
   * @param build - Build.
   * @param mod - Mod that adds restrictions.
   * @param moddedItemId - ID of the item the mod is being a part of.
   * @param itemToCheckPath - Path of the item to check.
   * @param itemToCheck - Item to check.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsRestrictedByMod(build: IBuild, mod: IItem, moddedItemId: string, itemToCheckPath: string, itemToCheck: IItem): string | undefined {
    const isModSlotItem = PathUtils.checkIsModSlotPath(itemToCheckPath)

    if (!isModSlotItem) {
      return undefined
    }

    const itemToCheckModdedItemId = PathUtils.getInventoryItemFromPath(build, itemToCheckPath).itemId

    if (itemToCheckModdedItemId !== moddedItemId) {
      return undefined
    }

    return this.checkIsConflicting(mod, itemToCheck)
  }

  /**
   * Checks whether an item is restricted because of a vest.
   * @param Vest - vest that adds restrictions.
   * @param itemToCheckPath - Path of the item to check.
   * @param itemToCheck - Item to check.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsRestrictedByVest(vest: IItem, itemToCheckPath: string, itemToCheck: IItem): string | undefined {
    const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath)

    if (!isInventorySlotItem) {
      return undefined
    }

    const inventorySlotTypeId = InventorySlotTypeId.bodyArmor // TODO

    if (inventorySlotTypeId === InventorySlotTypeId.bodyArmor) {
      return vuei18n.t('message.cannotAddBodyArmor')
    }

    return this.checkIsConflicting(vest, itemToCheck)
  }
}