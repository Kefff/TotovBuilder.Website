import { IItem } from '../../../models/item/IItem'
import { ISortingFunction } from './ISortingFunction'

/**
 * Provides the functionalities of a sorting function list.
 */
export interface ISortingFunctionList<TItem extends IItem> {
  [property: string]: ISortingFunction<TItem>
}