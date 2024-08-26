/**
 * Provides the functionalities of a toolbar button.
 */
export interface IToolbarButton {
  /**
   * Action to execute when the button is clicked.
   */
  action: () => void

  /**
   * Indicates whether the button can be moved from the the toolbar to the toolbar sidebar.
   */
  canBeMovedToSidebar: () => boolean

  /**
   * Method for getting the caption.
   * Displayed if showCaption is true; otherwise is in a tooltip.
   */
  caption: () => string

  /**
   * Method for getting the icon name.
   */
  icon: () => string

  /**
   * Method for indicating whether the button is disabled.
   */
  isDisabled: () => boolean

  /**
   * Name.
   */
  name: string

  /**
   * Indicates the side of the toolbar the button is displayed.
   */
  position: () => 'left' | 'right'

  /**
   * Method for indicating whether the button caption is shown.
   * When true, it is displayed as long as the trigger that hides buttons is not reached.
   */
  showCaption: () => boolean

  /**
   * Button style.
   */
  style?: () => 'discreet' | 'outlined'

  /**
   * Variant.
   */
  variant?: () => 'danger' | 'help' | 'info' | 'secondary' | 'success' | 'warning'

  /**
   * Method for indicating whether the button is visible.
   */
  visible: () => boolean
}