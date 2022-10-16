import { IArmor } from './IArmor'
import { IModdable } from './IModdable'

/**
 * Provides the functionalities of headwear.
 */
export interface IHeadwear extends IArmor, IModdable {
  /**
   * Indicates whether headphones are block by the helmet.
   */
  blocksHeadphones: boolean

  /**
   * Severity of the hearing impairment caused by the helmet.
   */
  deafening: string
}