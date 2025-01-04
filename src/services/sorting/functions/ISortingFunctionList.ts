/* eslint-disable @typescript-eslint/no-unused-vars */
import { ItemCategoryId } from '../../../models/item/IItem'
import { ISortingFunction } from './ISortingFunction'

/**
 * Provides the functionalities of a build sorting function list.
 */
export interface IBuildSortingFunctionList extends ISortingFunctionList { }

/**
 * Provides the functionalities of an item sorting function list.
 */
export interface IItemSortingFunctionList extends ISortingFunctionList {
  /**
   * Categories of item that can be sorted using the functions.
   */
  itemCategoryIds: ItemCategoryId[]
}

/**
 * Provides the functionalities of an element sorting function list.
 */
export interface ISortingFunctionList {
  /**
   * Sorting functions.
   */
  functions: { [property: string]: ISortingFunction }
}