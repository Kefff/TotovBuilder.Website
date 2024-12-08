import { IBuildSummary } from './IBuildSummary'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class BuildFilterAndSortingData extends SortingData<IBuildSummary> {
  /**
   * Filter.
   */
  public filter?: string
}