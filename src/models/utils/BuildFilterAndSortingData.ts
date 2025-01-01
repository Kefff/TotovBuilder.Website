import { BuildSummarySortingFunctions } from '../../services/sorting/functions/BuildSummarySortingFunctions'
import { IBuildSummary } from './IBuildSummary'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class BuildFilterAndSortingData extends SortingData<IBuildSummary> {
  /**
   * Initializes a new instance of the SortingData class.
   */
  public constructor() {
    super(BuildSummarySortingFunctions)
  }

  /**
   * Filter.
   */
  public filter?: string

  /**
   * Indicates whether the filter field should be focused.
   */
  public focusFilter?: boolean
}