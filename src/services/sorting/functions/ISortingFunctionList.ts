import { ISortingFunction } from './ISortingFunction'

/**
 * Provides the functionalities of a sorting function list.
 */
export interface ISortingFunctionList {
  [property: string]: ISortingFunction
}