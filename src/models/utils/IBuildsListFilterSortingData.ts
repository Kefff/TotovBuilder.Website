import { SortingOrder } from './SortingOrder'

/**
 * Provides the functionalities of data for filtering and sorting the builds list.
 */
export interface IBuildsListFilterSortingData {
  /**
   * Name of the field currently used to sort.
   */
  currentSortField: string

  /**
   * Current sort order.
   */
  currentSortOrder: SortingOrder

  /**
   * Filter.
   */
  filter?: string
}