import { IGeneralOption } from './IGeneralOption'

/**
 * Provides the functionalities of a group of general options.
 */
export interface IGeneralOptionsGroup {
  /**
   * Name of the resource to use as the caption.
   */
  caption: string,

  /**
   * Name of the icon to display.
   */
  icon: string,

  /**
   * Name of the group.
   */
  name: 'display-options' | 'general-options' | string,

  /**
   * Options included in the group.
   */
  options: IGeneralOption[]
}