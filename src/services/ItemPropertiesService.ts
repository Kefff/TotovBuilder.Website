import { IItem } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'

/**
 * Represents a service responsible for managing properties of an item.
 */
export class ItemPropertiesService {
  /**
   * Indicates whether an item can be modded or not.
   * @param item - Item.
   * @returns true if the item can be modded; otherwise false.
   */
  public canBeModded(item: IItem): boolean {
    return this.isModdable(item) && (((item as unknown) as Record<string, unknown>)['modSlots'] as IModSlot[]).length > 0
  }

  /**
   * Indicates whether an item can contain items or not.
   * @param item - Item.
   * @returns true if the item can contain items; otherwise false.
   */
  public canContain(item: IItem): boolean {
    return this.isContainer(item) && ((item as unknown) as Record<string, unknown>)['capacity'] as number > 0
  }

  /**
   * Indicates whether an item can have an armor value (armor, armor mod, headwear, vest) or not.
   * @param item - Item.
   * @returns true if the item can have an armor value; otherwise false.
   */
  public canHaveArmor(item: IItem): boolean {
    const armorClass = ((item as unknown) as Record<string, unknown>)['armorClass'] as number

    return armorClass != null
  }

  /**
   * Indicates whether an item has an armor value (armor, armor mod, headwear, vest) or not.
   * @param item - Item.
   * @returns true if the item has have an armor value; otherwise false.
   */
  public hasArmor(item: IItem): boolean {
    return this.canHaveArmor(item) && (((item as unknown) as Record<string, unknown>)['armorClass'] as number) > 0
  }

  /**
   * Indicates whether an item is an ammunition or not.
   * @param item - Item.
   * @returns true if the item is an ammunition; otherwise false.
   */
  public isAmmunition(item: IItem): boolean {
    const ammunition = ((item as unknown) as Record<string, unknown>)['fleshDamage'] as number

    return ammunition != null
  }

  /**
   * Indicates whether an item can have an armor value (armor, vest, helmet) or not.
   * @param item - Item.
   * @returns true if the item can have an armor value; otherwise false.
   */
  public isArmor(item: IItem): boolean {
    return this.canHaveArmor(item) && !this.isArmorMod(item) && !this.isHeadwear(item) && !this.isVest(item)
  }

  /**
   * Indicates whether an item can have an armor value (armor, vest, helmet) and is moddable or not.
   * @param item - Item.
   * @returns true if the item can have an armor value and is moddable; otherwise false.
   */
  public isArmorMod(item: IItem): boolean {
    return this.canHaveArmor(item) && this.isModdable(item) && !this.isHeadwear(item)
  }

  /**
   * Indicates whether an item is a container or not.
   * @param item - Item.
   * @returns true if the item is a container; otherwise false.
   */
  public isContainer(item: IItem): boolean {
    const capacity = ((item as unknown) as Record<string, unknown>)['capacity'] as number

    return capacity != null
  }

  /**
   * Indicates whether an item is a headwear or not.
   * @param item - Item.
   * @returns true if the item a headwear; otherwise false.
   */
  public isHeadwear(item: IItem): boolean {
    const blocksHeadphones = ((item as unknown) as Record<string, unknown>)['blocksHeadphones'] as boolean

    return blocksHeadphones != null
  }

  /**
   * Indicates whether an item is a mod or not.
   * @param item - Item.
   * @returns true if the item is a mod; otherwise false.
   */
  public isMod(item: IItem): boolean {
    const ergonomicsModifier = ((item as unknown) as Record<string, unknown>)['ergonomicsModifier'] as number

    return ergonomicsModifier != null
  }

  /**
   * Indicates whether an item is moddable or not.
   * @param item - Item.
   * @returns true if the item is moddable; otherwise false.
   */
  public isModdable(item: IItem): boolean {
    const modSlots = ((item as unknown) as Record<string, unknown>)['modSlots'] as IModSlot[]

    return modSlots != null
  }

  /**
   * Indicates whether an item is a ranged weapon or not.
   * @param item - Item
   * @returns true if the item is a ranged weapon; otherwise false.
   */
  public isRangedWeapon(item: IItem): boolean {
    const fireRate = ((item as unknown) as Record<string, unknown>)['fireRate'] as number

    return fireRate != null
  }

  /**
   * Indicates whether an item is a ranged weapon mod or not.
   * @param item - Item
   * @returns true if the item is a ranged weapon mod; otherwise false.
   */
  public isRangedWeaponMod(item: IItem): boolean {
    const recoilPercentageModifier = ((item as unknown) as Record<string, unknown>)['recoilPercentageModifier'] as number

    return recoilPercentageModifier != null
  }

  /**
   * Indicates whether an item is a vest or not.
   * @param item - Item
   * @returns true if the item is a vest; otherwise false.
   */
  public isVest(item: IItem): boolean {
    return this.canHaveArmor(item) && this.isContainer(item)
  }
}