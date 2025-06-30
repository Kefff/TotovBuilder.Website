import { IArmor } from '../models/item/IArmor'
import { IContainer } from '../models/item/IContainer'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IModdable } from '../models/item/IModdable'
import StringUtils from '../utils/StringUtils'

/**
 * Represents a service responsible for managing properties of an item.
 */
export class ItemPropertiesService {
  /**
   * Indicates whether an item can be modded.
   * @param item - Item.
   * @returns `true` if the item can be modded; otherwise `false`.
   */
  public canBeModded(item: IItem): boolean {
    return this.isModdable(item) && (item as IModdable).modSlots.length > 0
  }

  /**
   * Indicates whether an item can contain items.
   * @param item - Item.
   * @returns `true` if the item can contain items; otherwise `false`.
   */
  public canContain(item: IItem): boolean {
    return (this.isBackpack(item) || this.isContainer(item) || this.isMagazine(item) || this.isVest(item))
      && (item as IContainer).capacity > 0
  }

  /**
   * Indicates whether an item can have an armor value (armor, armor mod, headwear, vest).
   * @param item - Item.
   * @returns `true` if the item can have an armor value; otherwise `false`.
   */
  public canHaveArmor(item: IItem): boolean {
    return this.isArmor(item)
      || this.isArmorMod(item)
      || this.isFaceCover(item)
      || this.isHeadwear(item)
      || this.isVest(item)
  }

  /**
   * Checks whether an item matches the filter.
   * @param itemToCheck - Item that must be checked against the filter.
   * @param filter - Filter.
   * @returns `true` when the item matches the filter; otherwise `false`.
   */
  public checkMatchesFilter(itemToCheck: IItem, filter: string): boolean {
    const filterWords = filter.split(' ')
    let contains = StringUtils.containsAll(itemToCheck.shortName, filterWords)

    if (contains) {
      return true
    }

    contains = StringUtils.containsAll(itemToCheck.name, filterWords)

    return contains
  }

  /**
   * Indicates whether an item has an armor value (armor, armor mod, headwear, vest).
   * @param item - Item.
   * @returns `true` if the item has have an armor value; otherwise `false`.
   */
  public hasArmor(item: IItem): boolean {
    return this.canHaveArmor(item) && (item as IArmor).armorClass > 0
  }

  /**
   * Indicates whether an item is ammunition.
   * @param value - Item or category ID.
   * @returns `true` if the item is ammunition; otherwise `false`.
   */
  public isAmmunition(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.ammunition
  }

  /**
   * Indicates whether an item is an armor.
   * @param value - Item or category ID.
   * @returns `true` if the item is an armor; otherwise `false`.
   */
  public isArmor(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.armor
  }

  /**
   * Indicates whether an item is an armor mod.
   * @param value - Item or category ID.
   * @returns `true` if the item is an armor mod; otherwise `false`.
   */
  public isArmorMod(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.armorMod
  }

  /**
   * Indicates whether an item is a backpack.
   * @param value - Item or category ID.
   * @returns `true` if the item is a backpack; otherwise `false`.
   */
  public isBackpack(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.backpack
  }

  /**
   * Indicates whether an item is a container.
   * @param value - Item or category ID.
   * @returns `true` if the item is a container; otherwise `false`.
   */
  public isContainer(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.securedContainer || categoryId === ItemCategoryId.container
  }

  /**
   * Indicates whether an item is eyewear.
   * @param value - Item or category ID.
   * @returns `true` if the item is eyewear; otherwise `false`.
   */
  public isEyewear(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.eyewear
  }

  /**
   * Indicates whether an item is a face cover.
   * @param value - Item or category ID.
   * @returns `true` if the item is a face cover; otherwise `false`.
   */
  public isFaceCover(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.faceCover
  }

  /**
   * Indicates whether an item is a grenade.
   * @param value - Item or category ID.
   * @returns `true` if the item is a grenade; otherwise `false`.
   */
  public isGrenade(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.grenade
  }

  /**
   * Indicates whether an item is headphones.
   * @param value - Item or category ID.
   * @returns `true` if the item is headphones; otherwise `false`.
   */
  public isHeadphones(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.headphones
  }

  /**
   * Indicates whether an item is headwear.
   * @param value - Item or category ID.
   * @returns `true` if the item is headwear; otherwise `false`.
   */
  public isHeadwear(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.headwear
  }

  /**
   * Indicates whether an item is a magazine.
   * @param value - Item or category ID.
   * @returns `true` if the item is a magazine; otherwise `false`.
   */
  public isMagazine(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.magazine
  }

  /**
   * Indicates whether an item is a melee weapon.
   * @param value - Item or category ID.
   * @returns `true` if the item is a melee weapon; otherwise `false`.
   */
  public isMeleeWeapon(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.meleeWeapon
  }

  /**
   * Indicates whether an item is a mod.
   * @param value - Item or category ID.
   * @returns `true` if the item is a mod; otherwise `false`.
   */
  public isMod(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.mod
  }

  /**
   * Indicates whether an item is moddable.
   * @param value - Item or category ID.
   * @returns `true` if the item is moddable; otherwise `false`.
   */
  public isModdable(value: IItem | ItemCategoryId): boolean {
    return this.isArmor(value)
      || this.isArmorMod(value)
      || this.isHeadwear(value)
      || this.isMagazine(value)
      || this.isMod(value)
      || this.isRangedWeapon(value)
      || this.isRangedWeaponMod(value)
      || this.isVest(value)
  }

  /**
   * Indicates whether an item is a ranged weapon.
   * @param value - Item or category ID.
   * @returns `true` if the item is a ranged weapon; otherwise `false`.
   */
  public isRangedWeapon(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.mainWeapon || categoryId === ItemCategoryId.secondaryWeapon
  }

  /**
   * Indicates whether an item is a ranged weapon mod.
   * @param value - Item or category ID.
   * @returns `true` if the item is a ranged weapon mod; otherwise `false`.
   */
  public isRangedWeaponMod(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.rangedWeaponMod
  }

  /**
   * Indicates whether an item is a vest.
   * @param value - Item or category ID.
   * @returns `true` if the item is a vest; otherwise `false`.
   */
  public isVest(value: IItem | ItemCategoryId): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === ItemCategoryId.vest
  }

  /**
   * Indicates whether an item is wearable.
   * @param value - Item or category ID.
   * @returns `true` if the item is wearable; otherwise `false`.
   */
  public isWearable(value: IItem | ItemCategoryId): boolean {
    return this.isArmor(value)
      || this.isArmorMod(value)
      || this.isBackpack(value)
      || this.isEyewear(value)
      || this.isFaceCover(value)
      || this.isHeadwear(value)
      || this.isVest(value)
  }

  /**
   * Gets a category ID from an item or a string.
   * @param value - Item or category ID.
   * @returns Category ID.
   */
  private getCategoryId(value: IItem | ItemCategoryId): ItemCategoryId {
    if (typeof value === 'object') {
      return value.categoryId
    } else {
      return value
    }
  }
}