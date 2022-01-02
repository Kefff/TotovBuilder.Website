import { IItem } from './IItem'

/**
 * Provides the functionalities of an item that can contain other items.
 */
export interface IContainer extends IItem {
  /**
   * Capacity.
   */
  capacity: number
}