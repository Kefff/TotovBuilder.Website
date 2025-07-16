import { IGlobalSidebarOptions } from './IGlobalSidebarOptions'

/**
 * Provides the functionalities of a global sidebar.
 */
export interface IGlobalSidebar {
  /**
   * Identifier of the sidebar.
   */
  identifier: number,

  /**
   * Options.
   */
  options: IGlobalSidebarOptions
}