/**
 * Represents a filter used to exclude available items.
 */
export interface IItemExclusionFilter {
  /**
   * Indicates whether the filter is enabled.
   */
  enabled: boolean

  /**
   * Name of the filter.
   */
  name: string
}