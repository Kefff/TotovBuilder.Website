import { IItem } from './IItem'

/**
 * Provides the functionalities of ammunition.
 */
export interface IAmmunition extends IItem {
  /**
   * Modifier added to the weapon accuracy in percentage.
   */
  accuracyModifierPercentage: number

  /**
   * Armor damage percentage.
   */
  armorDamagePercentage: number

  /**
   * Indicates whether the ammunitions can blind opponents.
   */
  blinding: boolean

  /**
   * Caliber.
   */
  caliber: string

  /**
   * Durability burn modifier percentage.
   */
  durabilityBurnModifierPercentage: number

  /**
   * Damage done the the body when penetrating armor.
   */
  fleshDamage: number

  /**
   * Percentage of chance to fragment and inflict additional damage to the body.
   */
  fragmentationChance: number

  /**
   * Percentage of chance to inflict a heavy bleeding when hitting flesh.
   */
  heavyBleedingChance: number

  /**
   * Percentage of chance to inflict a light bleeding when hitting flesh.
   */
  lightBleedingChance: number

  /**
   * Armor level a bullet can easily penetrate.
   */
  penetratedArmorLevel: number

  /**
   * Armor penetration power.
   */
  penetrationPower: number

  /**
   * Number of projectiles.
   * Usually 1 except for shotgun buckshot ammunition which fires multiple pellets.
   */
  projectiles: number

  /**
   * Modifier added to the weapon recoil.
   */
  recoilModifier: number

  /**
   * Indicates whether the ammunition is subsonic or not.
   */
  subsonic: boolean

  /**
   * Indicates whether the ammunition is will have a coloured trail while flying.
   */
  tracer: boolean

  /**
   * Bullet velocity.
   */
  velocity: number
}