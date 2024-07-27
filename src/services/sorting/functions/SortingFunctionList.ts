/* eslint-disable @typescript-eslint/no-unused-vars */
import { IItem } from '../../../models/item/IItem'
import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import { ISortingFunction } from './ISortingFunction'

/**
 * Represents the functionalities of an element sorting function list.
 */
export interface ISortingFunctionList<T extends IBuildSummary | IItem> {
  [property: string]: ISortingFunction<T>
}