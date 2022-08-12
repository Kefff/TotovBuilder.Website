import { IContainer } from './IContainer'
import { IMod } from './IMod'

/**
 * Provides the functionalities of a magazine.
 */
export interface IMagazine extends IContainer, IMod {
  /**
   * IDs of accepted ammunition.
   */
  acceptedAmmunitionIds: string[]

  /**
   * Modifier added to the check speed in percentage.
   */
  checkSpeedPercentageModifier: number

  /**
   * Modifier added to the loading speed in percentage.
   */
  loadSpeedPercentageModifier: number

  /**
   * Malfunction chance in percentage.
   */
  malfunctionPercentage: number
}