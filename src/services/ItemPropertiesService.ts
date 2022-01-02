import { IItem } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'

/**
 * Represents a service responsible for managing properties of an item.
 */
export class ItemPropertiesService {
  /**
   * Indicates whether an item is an ammunition or not.
   * @param item - Item
   * @returns true if the item is an ammunition; otherwise false.
   */
  public isAmmunition(item: IItem): boolean {
    const ammunition = ((item as unknown) as Record<string, unknown>)['fleshDamage'] as number

    return ammunition !== undefined
  }

  /**
   * Indicates whether an item can have an armor value (armor, vest, helmet) or not.
   * @param item - Item
   * @returns true if the item can have an armor value; otherwise false.
   */
  public isArmor(item: IItem): boolean {
    const armorClass = ((item as unknown) as Record<string, unknown>)['armorClass'] as number

    return armorClass !== undefined
  }

  /**
   * Indicates whether an item is a container or not.
   * @param item - Item
   * @returns true if the item is a container; otherwise false.
   */
  public isContainer(item: IItem): boolean {
    const capacity = ((item as unknown) as Record<string, unknown>)['capacity'] as number

    return (capacity ?? 0) > 0
  }

  /**
   * Indicates whether an item is a mod or not.
   * @param item - Item
   * @returns true if the item is a mod; otherwise false.
   */
  public isMod(item: IItem): boolean {
    const ergonomicsModifier = ((item as unknown) as Record<string, unknown>)['ergonomicsModifier'] as number

    return ergonomicsModifier !== undefined
  }

  /**
   * Indicates whether an item is moddable or not.
   * @param item - Item
   * @returns true if the item is moddable; otherwise false.
   */
  public isModdable(item: IItem): boolean {
    const modSlots = ((item as unknown) as Record<string, unknown>)['modSlots'] as IModSlot[]

    return (modSlots ?? []).length > 0
  }

  /**
   * Indicates whether an item is a ranged weapon or not.
   * @param item - Item
   * @returns true if the item is a ranged weapon; otherwise false.
   */
  public isRangedWeapon(item: IItem): boolean {
    const fireRate = ((item as unknown) as Record<string, unknown>)['fireRate'] as number

    return fireRate !== undefined
  }

  /**
   * Indicates whether an item is a ranged weapon mod or not.
   * @param item - Item
   * @returns true if the item is a ranged weapon mod; otherwise false.
   */
  public isRangedWeaponMod(item: IItem): boolean {
    const recoilPercentageModifier = ((item as unknown) as Record<string, unknown>)['recoilPercentageModifier'] as number

    return recoilPercentageModifier !== undefined
  }
}