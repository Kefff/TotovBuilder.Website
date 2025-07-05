import vuei18n from '../../plugins/vueI18n'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import { IBuild } from '../build/IBuild'
import { IInventoryItem } from '../build/IInventoryItem'
import { InventorySlotTypeId } from '../build/InventorySlotTypes'
import { IItem } from '../item/IItem'
import { IVest } from '../item/IVest'
import { IItemSelectionRestriction } from './IItemSelectionRestriction'

/**
 * Represents a list of item selection restrictions applied to a build.
 */
export class ItemSelectionRestrictionList {
  public static async createAsync(buildPath: string, build: IBuild): Promise<ItemSelectionRestrictionList> {
    const instance = new ItemSelectionRestrictionList()
    await instance.initializeAsync(buildPath, build)

    return instance
  }

  /**
   * Restrictions.
   */
  public get restrictions(): IItemSelectionRestriction[] {
    return this._restrictions
  }
  private _restrictions: IItemSelectionRestriction[] = []

  /**
   * Adds restrictions for an item if this item has restrictions.
   * @param path - Path of the item that adds restrictions.
   * @param item - Item that adds restrictions.
   */
  private add(path: string, item: IItem): void {
    if (this.addArmorRestrictions(path, item)) {
      return
    }

    if (this.addHeadwearRestrictions(path, item)) {
      return
    }

    if (this.addVestRestrictions(path, item)) {
      return
    }

    if (this.addModRestrictions(path, item)) {
      return
    }

    this.addInventorySlotItemRestrictions(path, item)
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

    this._restrictions.push({
      checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByHeadwear(headwear, itcp, itc),
      item: headwear,
      path
    })

    return true
  }

  /**
   * Adds an item restrictions.
   * @param itemPath - Path of the item.
   * @param inventoryItem - Item.
   */
  private async addItemRestrictionsAsync(itemPath: string, inventoryItem: IInventoryItem | undefined): Promise<void> {
    if (inventoryItem == null) {
      return
    }

    const itemService = Services.get(ItemService)
    const item = await itemService.getItemAsync(inventoryItem.itemId)
    this.add(itemPath, item)

    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.item != null) {
        const modSlotItemPath = PathUtils.getItemPath(PathUtils.getModSlotPath(itemPath, modSlot.modSlotName), modSlot.item.itemId)
        await this.addItemRestrictionsAsync(modSlotItemPath, modSlot.item)
      }
    }

    for (let i = 0; i < inventoryItem.content.length; i++) {
      const containedItemPath = PathUtils.getContainedItemPath(itemPath, i, inventoryItem.content.length, inventoryItem.content[i].itemId)
      await this.addItemRestrictionsAsync(containedItemPath, inventoryItem.content[i])
    }
  }

  /**
   * Adds restrictions related to an inventory item conflicting with another inventory item.
   * @param path - Path of the item that adds restrictions.
   * @param item - Item that adds restrictions.
   */
  private addInventorySlotItemRestrictions(path: string, item: IItem): boolean {
    const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(path)

    if (!isInventorySlotItem) {
      return false
    }

    this._restrictions.push({
      checkIsRestricted: (itcp, itc) => {
        const isInventorySlotItem = PathUtils.checkIsInventorySlotItem(itcp)

        if (isInventorySlotItem) {
          return this.checkIsConflicting(item, itc)
        }

        return undefined
      },
      item,
      path
    })

    return true
  }

  /**
   * Adds restrictions related to a mod in a modslot.
   * @param build - Build.
   * @param path - Path of the mod that adds restrictions.
   * @param mod - Mod that adds restrictions.
   * @returns - `true` if the mod has added restrictions; otherwise `false`.
   */
  private addModRestrictions(path: string, mod: IItem): boolean {
    const isModSlotItem = PathUtils.checkIsModSlotPath(path)

    if (!isModSlotItem) {
      return false
    }

    const moddedItemId = PathUtils.getModdedItemIdFromPath(path)

    if (moddedItemId == null) {
      return false
    }

    this._restrictions.push({
      checkIsRestricted: (itcp, itc) => this.checkIsRestrictedByMod(mod, moddedItemId, itcp, itc),
      item: mod,
      path
    })

    return true
  }

  /**
   * Adds restrictions related to wearing a vest.
   * @param path - Path of the vest that adds restrictions.
   * @param vest - Vest.
   * @returns - `true` if the vest has added restrictions; otherwise `false`.
   */
  private addVestRestrictions(path: string, vest: IItem): boolean {
    const isTacticalRigInventorySlotItem = PathUtils.checkIsInventorySlotItem(path, InventorySlotTypeId.tacticalRig)

    if (!isTacticalRigInventorySlotItem) {
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
    const isTacticalRigInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath, InventorySlotTypeId.tacticalRig)

    if (isTacticalRigInventorySlotItem && (itemToCheck as IVest).armoredAreas.length > 0) {
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
    const isEarpieceInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath, InventorySlotTypeId.earpiece)

    if (isEarpieceInventorySlotItem) {
      return vuei18n.t('message.cannotAddEarpiece', { conflictingItemName: headwear.name })
    }

    return this.checkIsConflicting(headwear, itemToCheck)
  }

  /**
   * Checks whether an item is restricted because of a mod.
   * @param mod - Mod that adds restrictions.
   * @param moddedItemId - ID of the item the mod is being a part of.
   * @param itemToCheckPath - Path of the item to check.
   * @param itemToCheck - Item to check.
   * @returns Reason of the restriction if the item is restricted; otherwise `undefined`.
   */
  private checkIsRestrictedByMod(mod: IItem, moddedItemId: string, itemToCheckPath: string, itemToCheck: IItem): string | undefined {
    const isModSlotItem = PathUtils.checkIsModSlotPath(itemToCheckPath)

    if (!isModSlotItem) {
      return undefined
    }

    const itemToCheckModdedItemId = PathUtils.getModdedItemIdFromPath(itemToCheckPath)

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
    const isArmorInventorySlotItem = PathUtils.checkIsInventorySlotItem(itemToCheckPath, InventorySlotTypeId.bodyArmor)

    if (isArmorInventorySlotItem) {
      return vuei18n.t('message.cannotAddBodyArmor')
    }

    return this.checkIsConflicting(vest, itemToCheck)
  }

  /**
   * Initializes an item selection restriction list.
   * @param buildPath - Path of the build.
   * @param build - Build for which the restrictions are set.
   */
  private async initializeAsync(buildPath: string, build: IBuild): Promise<void> {
    for (const inventorySlot of build.inventorySlots) {
      const inventorySlotPath = PathUtils.getInventorySlotPath(buildPath, inventorySlot.typeId)

      for (let i = 0; i < inventorySlot.items.length; i++) {
        const inventoryItem = inventorySlot.items[i]
        const itemPath = PathUtils.getInventorySlotItemPath(inventorySlotPath, i, inventoryItem?.itemId)
        await this.addItemRestrictionsAsync(itemPath, inventoryItem)
      }
    }
  }
}