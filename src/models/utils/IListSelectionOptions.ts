
/**
 * Provides the functionalities of options for configuring the selection of elements in a list.
 */
export interface IListSelectionOptions {
  /**
   * Indicates whether it is possible to unselect selected elements.
   */
  canUnselect: boolean

  /**
   * Indicates whether the selection is enabled.
   */
  isEnabled: boolean

  /**
   * Indicates whether multiple elements can be selected.
   */
  isMultiSelection: boolean

  /**
   * Caption to display on the selection button of each element.
   */
  selectionButtonCaption?: string

  /**
   * Item to display on the selection button of each element.
   */
  selectionButtonIcon?: string

  /**
   * Show the difference in stats between the selected element and other element when isMultiSelection is false.
   */
  showStatsComparison?: boolean
}