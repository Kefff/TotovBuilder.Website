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
    return (this.isContainer(item) || this.isMagazine(item) || this.isVest(item))
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
   * @param item - Item.
   * @returns true if the item is ammunition; otherwise false.
   */
  public isAmmunition(item: IItem): boolean {
    return item.categoryId === 'ammunition'
  }

  /**
   * Indicates whether an item is an armor.
   * @param item - Item.
   * @returns true if the item is an armor; otherwise false.
   */
  public isArmor(item: IItem): boolean {
    return item.categoryId === 'armor'
  }

  /**
   * Indicates whether an item is an armor mod.
   * @param item - Item.
   * @returns true if the item is an armor mod; otherwise false.
   */
  public isArmorMod(item: IItem): boolean {
    return item.categoryId === 'armorMod'
  }

  /**
   * Indicates whether an item is a container.
   * @param item - Item.
   * @returns true if the item is a container; otherwise false.
   */
  public isContainer(item: IItem): boolean {
    return item.categoryId === 'backpack' || item.categoryId === 'securedContainer' || item.categoryId === 'container'
  }

  /**
   * Indicates whether an item is eyewear.
   * @param item - Item.
   * @returns true if the item is eyewear; otherwise false.
   */
  public isEyewear(item: IItem): boolean {
    return item.categoryId === 'eyewear'
  }

  /**
   * Indicates whether an item is a grenade.
   * @param item - Item.
   * @returns true if the item is a grenade; otherwise false.
   */
  public isGrenade(item: IItem): boolean {
    return item.categoryId === 'grenade'
  }

  /**
   * Indicates whether an item is headwear.
   * @param item - Item.
   * @returns true if the item is headwear; otherwise false.
   */
  public isHeadwear(item: IItem): boolean {
    return item.categoryId === 'headwear'
  }

  /**
   * Indicates whether an item is a magazine.
   * @param item - Item.
   * @returns true if the item is a magazine; otherwise false.
   */
  public isMagazine(item: IItem): boolean {
    return item.categoryId === 'magazine'
  }

  /**
   * Indicates whether an item is a melee weapon.
   * @param item - Item.
   * @returns true if the item is a melee weapon; otherwise false.
   */
  public isMeleeWeapon(item: IItem): boolean {
    return item.categoryId === 'meleeWeapon'
  }

  /**
   * Indicates whether an item is a mod.
   * @param item - Item.
   * @returns true if the item is a mod; otherwise false.
   */
  public isMod(item: IItem): boolean {
    return item.categoryId === 'mod'
  }

  /**
   * Indicates whether an item is moddable.
   * @param item - Item.
   * @returns true if the item is moddable; otherwise false.
   */
  public isModdable(item: IItem): boolean {
    return this.isArmorMod(item)
      || this.isHeadwear(item)
      || this.isMagazine(item)
      || this.isMod(item)
      || this.isRangedWeapon(item)
      || this.isRangedWeaponMod(item)
  }

  /**
   * Indicates whether an item is a ranged weapon.
   * @param item - Item
   * @returns true if the item is a ranged weapon; otherwise false.
   */
  public isRangedWeapon(item: IItem): boolean {
    return item.categoryId === 'mainWeapon' || item.categoryId === 'secondaryWeapon'
  }

  /**
   * Indicates whether an item is a ranged weapon mod.
   * @param item - Item
   * @returns true if the item is a ranged weapon mod; otherwise false.
   */
  public isRangedWeaponMod(item: IItem): boolean {
    return item.categoryId === 'rangedWeaponMod'
  }

  /**
   * Indicates whether an item is a vest.
   * @param item - Item
   * @returns true if the item is a vest; otherwise false.
   */
  public isVest(item: IItem): boolean {
    return item.categoryId === 'vest'
  }
}