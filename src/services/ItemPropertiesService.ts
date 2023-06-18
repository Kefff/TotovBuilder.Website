import { IArmor } from '../models/item/IArmor'
import { IContainer } from '../models/item/IContainer'
import { IItem } from '../models/item/IItem'
import { IModdable } from '../models/item/IModdable'

/**
 * Represents a service responsible for managing properties of an item.
 */
export class ItemPropertiesService {
  /**
   * Indicates whether an item can be modded.
   * @param item - Item.
   * @returns true if the item can be modded; otherwise false.
   */
  public canBeModded(item: IItem): boolean {
    return this.isModdable(item) && (item as IModdable).modSlots.length > 0
  }

  /**
   * Indicates whether an item can contain items.
   * @param item - Item.
   * @returns true if the item can contain items; otherwise false.
   */
  public canContain(item: IItem): boolean {
    return (this.isBackpack(item) || this.isContainer(item) || this.isMagazine(item) || this.isVest(item))
      && (item as IContainer).capacity > 0
  }

  /**
   * Indicates whether an item can have an armor value (armor, armor mod, headwear, vest).
   * @param item - Item.
   * @returns true if the item can have an armor value; otherwise false.
   */
  public canHaveArmor(item: IItem): boolean {
    return this.isArmor(item) || this.isArmorMod(item) || this.isHeadwear(item) || this.isVest(item)
  }

  /**
   * Indicates whether an item has an armor value (armor, armor mod, headwear, vest).
   * @param item - Item.
   * @returns true if the item has have an armor value; otherwise false.
   */
  public hasArmor(item: IItem): boolean {
    return this.canHaveArmor(item) && (item as IArmor).armorClass > 0
  }

  /**
   * Indicates whether an item is ammunition.
   * @param value - Item or category ID.
   * @returns true if the item is ammunition; otherwise false.
   */
  public isAmmunition(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'ammunition'
  }

  /**
   * Indicates whether an item is an armor.
   * @param value - Item or category ID.
   * @returns true if the item is an armor; otherwise false.
   */
  public isArmor(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'armor'
  }

  /**
   * Indicates whether an item is an armor mod.
   * @param value - Item or category ID.
   * @returns true if the item is an armor mod; otherwise false.
   */
  public isArmorMod(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'armorMod'
  }

  /**
   * Indicates whether an item is a backpack.
   * @param value - Item or category ID.
   * @returns true if the item is a backpack; otherwise false.
   */
  public isBackpack(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'backpack'
  }

  /**
   * Indicates whether an item is a container.
   * @param value - Item or category ID.
   * @returns true if the item is a container; otherwise false.
   */
  public isContainer(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'securedContainer' || categoryId === 'container'
  }

  /**
   * Indicates whether an item is eyewear.
   * @param value - Item or category ID.
   * @returns true if the item is eyewear; otherwise false.
   */
  public isEyewear(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'eyewear'
  }

  /**
   * Indicates whether an item is a grenade.
   * @param value - Item or category ID.
   * @returns true if the item is a grenade; otherwise false.
   */
  public isGrenade(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'grenade'
  }

  /**
   * Indicates whether an item is headwear.
   * @param value - Item or category ID.
   * @returns true if the item is headwear; otherwise false.
   */
  public isHeadwear(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'headwear'
  }

  /**
   * Indicates whether an item is a magazine.
   * @param value - Item or category ID.
   * @returns true if the item is a magazine; otherwise false.
   */
  public isMagazine(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'magazine'
  }

  /**
   * Indicates whether an item is a melee weapon.
   * @param value - Item or category ID.
   * @returns true if the item is a melee weapon; otherwise false.
   */
  public isMeleeWeapon(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'meleeWeapon'
  }

  /**
   * Indicates whether an item is a mod.
   * @param value - Item or category ID.
   * @returns true if the item is a mod; otherwise false.
   */
  public isMod(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'mod'
  }

  /**
   * Indicates whether an item is moddable.
   * @param value - Item or category ID.
   * @returns true if the item is moddable; otherwise false.
   */
  public isModdable(value: IItem | string): boolean {
    return this.isArmorMod(value)
      || this.isHeadwear(value)
      || this.isMagazine(value)
      || this.isMod(value)
      || this.isRangedWeapon(value)
      || this.isRangedWeaponMod(value)
  }

  /**
   * Indicates whether an item is a ranged weapon.
   * @param value - Item or category ID.
   * @returns true if the item is a ranged weapon; otherwise false.
   */
  public isRangedWeapon(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'mainWeapon' || categoryId === 'secondaryWeapon'
  }

  /**
   * Indicates whether an item is a ranged weapon mod.
   * @param value - Item or category ID.
   * @returns true if the item is a ranged weapon mod; otherwise false.
   */
  public isRangedWeaponMod(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'rangedWeaponMod'
  }

  /**
   * Indicates whether an item is a vest.
   * @param value - Item or category ID.
   * @returns true if the item is a vest; otherwise false.
   */
  public isVest(value: IItem | string): boolean {
    const categoryId = this.getCategoryId(value)

    return categoryId === 'vest'
  }

  /**
   * Indicates whether an item is wearable.
   * @param value - Item or category ID.
   * @returns true if the item is wearable; otherwise false.
   */
  public isWearable(value: IItem | string): boolean {
    return this.isArmor(value) || this.isArmorMod(value) || this.isBackpack(value) || this.isHeadwear(value) || this.isVest(value)
  }

  /**
   * Gets a category ID from an item or a string.
   * @param value - Item or category ID.
   * @returns Category ID.
   */
  private getCategoryId(value: IItem | string): string {
    if (typeof value === 'string') {
      return value
    } else {
      return value.categoryId
    }
  }
}