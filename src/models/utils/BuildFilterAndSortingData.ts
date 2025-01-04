import { BuildSummarySortingFunctions } from '../../services/sorting/functions/BuildSummarySortingFunctions'
import FilterAndSortingData from './FilterAndSortingData'
import { IBuildSummary } from './IBuildSummary'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class BuildFilterAndSortingData extends FilterAndSortingData<IBuildSummary> {
  /**
   * Initializes a new instance of the SortingData class.
   * @param buildFilterAndSortingDataToCopy - Build filter and sorting data to copy.
   */
  public constructor(buildFilterAndSortingDataToCopy?: BuildFilterAndSortingData) {
    super(BuildSummarySortingFunctions, buildFilterAndSortingDataToCopy)
  }
}