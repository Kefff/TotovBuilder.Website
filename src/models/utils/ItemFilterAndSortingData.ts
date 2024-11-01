import { IItem } from '../item/IItem'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class ItemFilterAndSortingData extends SortingData<IItem> {
  /**
   * Category of item being sorted.
   */
  public category = ''

  /**
   * Filter.
   */
  public filter = ''
}