import { BuildSummarySortingFunctions } from '../../services/sorting/functions/BuildSummarySortingFunctions'
import { IBuildSummary } from './IBuildSummary'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class BuildFilterAndSortingData extends SortingData<IBuildSummary> {
  /**
   * Initializes a new instance of the SortingData class.
   * @param buildFilterAndSortingDataToCopy - Build filter and sorting data to copy.
   */
  public constructor(buildFilterAndSortingDataToCopy?: BuildFilterAndSortingData) {
    super(BuildSummarySortingFunctions, buildFilterAndSortingDataToCopy)

    if (buildFilterAndSortingDataToCopy != null) {
      this.filter = buildFilterAndSortingDataToCopy.filter
      this.focusFilter = buildFilterAndSortingDataToCopy.focusFilter
    }
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