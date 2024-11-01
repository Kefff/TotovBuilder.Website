/* eslint-disable @typescript-eslint/no-unused-vars */
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import { ISortingFunction } from './ISortingFunction'

/**
 * Provides the functionalities of a build sorting function list.
 */
export interface IBuildSortingFunctionList extends ISortingFunctionList<IBuildSummary> { }

/**
 * Provides the functionalities of an item sorting function list.
 */
export interface IItemSortingFunctionList extends ISortingFunctionList<IItem> {
  /**
   * Categories of item that can be sorted using the functions.
   */
  itemCategoryIds: ItemCategoryId[]
}

/**
 * Provides the functionalities of an element sorting function list.
 */
export interface ISortingFunctionList<T extends IBuildSummary | IItem> {
  /**
   * Sorting functions.
   */
  functions: { [property: string]: ISortingFunction<T> }
}