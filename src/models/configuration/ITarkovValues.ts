import { ICurrency } from './ICurrency'
import { IMerchant } from './IMerchant'
import { IRicochetChance } from './IRicochetChance'

/**
 * Provides the functionalities of values related to Tarkov gameplay.
 */
export interface ITarkovValues {
  /**
   * Armor penetration efficiencies.
   */
  armorPenetrationEfficiencies: string[]

  /**
   * Player character chest HP.
   */
  chestHp: number

  /**
   * Currencies.
   */
  currencies: ICurrency[]

  /**
   * Weight at which the character is heavily encumbered.
   */
  heavyEncumbermentWeight: number

  /**
   * Weight at which the character is lightly encumbered.
   */
  lightEncumbermentWeight: number

  /**
   * Merchants.
   */
  merchants: IMerchant[]

  /**
   * Ricochet chances.
   */
  ricochetChances: IRicochetChance[]
}