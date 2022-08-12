import { IItem } from './IItem'

/**
 * Provides the functionalities of ammunition.
 */
export interface IAmmunition extends IItem {
  /**
   * Modifier added to the weapon accuracy in percentage.
   */
  accuracyPercentageModifier: number

  /**
   * Armor damage percentage.
   */
  armorDamagePercentage: number

  /**
   * List of the penetration efficiencies by armor class.
   */
  armorPenetrations: number[]

  /**
   * Indicates whether the ammunitions can blind opponents.
   */
  blinding: boolean

  /**
   * Caliber.
   */
  caliber: string

  /**
   * Durability burn percentage modifier.
   */
  durabilityBurnPercentageModifier: number

  /**
   * Damage done the the body when penetrating armor.
   */
  fleshDamage: number

  /**
   * Percentage of chance to fragment and inflict additional damage to the body.
   */
  fragmentationChancePercentage: number

  /**
   * Percentage of chance to inflict a heavy bleeding when hitting flesh.
   */
  heavyBleedingPercentageChance: number

  /**
   * Percentage of chance to inflict a light bleeding when hitting flesh.
   */
  lightBleedingPercentageChance: number

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
   * Modifier added to the weapon recoil in percentage.
   */
  recoilPercentageModifier: number

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