import { IBuild } from '../build/IBuild'
import { IShoppingListItem } from '../build/IShoppingListItem'
import { IItem } from '../item/IItem'
import BuildFilterAndSortingData from './BuildFilterAndSortingData'
import { IBuildSummary } from './IBuildSummary'
import { IGeneralOptionsGroup } from './IGeneralOptionsGroup'

/**
 * Provides the functionalities of options passed to the global sidebar when opening it.
 */
export interface IGlobalSidebarOptions {
  /**
   * Name of the component to display in the global sidebar.
   */
  displayedComponentType: GlobalSidebarComponent

  /**
   * Parameters to pass as props to the component to display in the global sidebar.
   */
  displayedComponentParameters?: GlobalSidebarDisplayedComponentParameters

  /**
   * Action to execute when the sidebar is closed.
   * @param updatedParameters - Parameters with updated values if the opened sidebar has changed them.
   */
  onCloseAction?: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void>
}

/**
 * Build sidebar parameters.
 */
export type BuildSidebarParameters = IBuild

/**
 * Builds list sidebar parameters.
 */
export type BuildsListSidebarParameters = BuildFilterAndSortingData

/**
 * General options sidebar parameters.
 */
export type GeneralOptionsSidebarParameters = IGeneralOptionsGroup[]

/**
 * Components allowed to be displayed in a global sidebar.
 */
export type GlobalSidebarComponent =
  'BuildSidebar'
  | 'BuildsListSidebar'
  | 'ChangelogSidebar'
  | 'GeneralOptionsSidebar'
  | 'MerchantItemsOptionsSidebar'
  | 'NotificationsSidebar'
  | 'BuildsExportSidebar'
  | 'BuildShareSideBar'
  | 'ShoppingListSidebar'
  | 'StatsSidebar'

/**
 * Parameters allowed to be passed to a component displayed in the global sidebar.
 */
export type GlobalSidebarDisplayedComponentParameters =
  BuildsExportSidebarParameters
  | BuildShareSideBarParameters
  | BuildSidebarParameters
  | BuildsListSidebarParameters
  | GeneralOptionsSidebarParameters
  | ShoppingListSidebarParameters
  | StatsSidebarParameters

/**
 * Builds export sidebar parameters.
 */
export type BuildsExportSidebarParameters = IBuildSummary[]

/**
 * Share build sidebar parameters.
 */
export type BuildShareSideBarParameters = IBuild

/**
 * Shopping list sidebar parameters.
 */
export type ShoppingListSidebarParameters = {
  buildName: string,
  shoppingList: IShoppingListItem[]
}

/**
 * Stats sidebar parameters.
 */
export type StatsSidebarParameters = IItem