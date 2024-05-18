/**
 * Provides the functionalities of a general options.
 */
export interface IGeneralOption {
  /**
   * Name of the resource to use as the caption.
   */
  caption: string,

  /**
   * Function indicating whether the option is enabled.
   * @returns true when the option is enabled; otherwise false.
   */
  enabled?: () => boolean

  /**
   * Name of the icon to display.
   */
  icon: string,

  /**
   * Function to call when clicking on the option.
   */
  onClick: () => void
}