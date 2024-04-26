import { IArmor } from './IArmor'

/**
 * Provides the functionalities of headwear.
 */
export interface IHeadwear extends IArmor {
  /**
   * Indicates whether headphones are block by the helmet.
   */
  blocksHeadphones: boolean

  /**
   * Severity of the hearing impairment caused by the helmet.
   */
  deafening: string

  /**
   * Chance of ricochet.
   */
  ricochetChance: string
}