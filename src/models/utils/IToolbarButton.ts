
/**
 * Provides the functionalities of a toolbar button.
 */
export interface IToolbarButton {
  /**
   * Method to execute when the button is clicked.
   */
  action: () => void

  /**
   * Method for indicating whether the button can be moved from the the toolbar to the toolbar sidebar.
   * True by default.
   */
  canBeMovedToSidebar?: () => boolean

  /**
   * Method for getting the caption.
   * Displayed if showCaption is true; otherwise is in a tooltip.
   */
  caption: () => string

  /**
   * Indicates whether a separation is displayed after the button in the toolbar sidebar.
   */
  followedBySeparation?: boolean

  /**
   * Method for getting the icon name.
   */
  icon: () => string

  /**
   * Method for indicating whether the button is disabled.
   * False by default.
   */
  isDisabled?: () => boolean

  /**
   * Method for indicating whether the button is visible.
   * True by default.
   */
  isVisible?: () => boolean

  /**
   * Name.
   */
  name: string

  /**
   * Method for getting the side of the toolbar the button is displayed.
   * 'left' by default.
   */
  position?: () => 'left' | 'right'

  /**
   * Method for indicating whether the button caption is shown.
   * When 'auto', it is displayed as long as the trigger that hides buttons is not reached.
   * 'auto' by default.
   */
  showCaption?: () => 'always' | 'auto' | 'never'

  /**
   * Method for getting the button style.
   */
  style?: () => 'discreet' | 'outlined'

  /**
   * Method for getting the tooltip position.
   * 'top' by default.
   */
  tooltipPosition?: () => 'bottom' | 'left' | 'right' | 'top'

  /**
   * Method for getting the variant.
   * Primary variant is used by default.
   */
  variant?: () => 'danger' | 'help' | 'info' | 'secondary' | 'success' | 'warning'
}