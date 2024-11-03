import { IBuild } from '../build/IBuild'
import { IShoppingListItem } from '../build/IShoppingListItem'
import { IItem } from '../item/IItem'
import BuildFilterAndSortingData from './BuildFilterAndSortingData'
import { IBuildSummary } from './IBuildSummary'
import { IGeneralOptionsGroup } from './IGeneralOptionsGroup'
import ItemFilterAndSortingData from './ItemFilterAndSortingData'
import { IToolbarButton } from './IToolbarButton'

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
 * Items  list sidebar parameters.
 */
export type ItemsListSidebarParameters = ItemFilterAndSortingData

/**
 * Components allowed to be displayed in a global sidebar.
 */
export type GlobalSidebarComponent =
  'BuildsExportSidebar'
  | 'BuildsImportSidebar'
  | 'BuildsShareSideBar'
  | 'BuildSidebar'
  | 'BuildsListSidebar'
  | 'ChangelogSidebar'
  | 'GeneralOptionsSidebar'
  | 'ItemsListSidebar'
  | 'MerchantItemsOptionsSidebar'
  | 'NotificationsSidebar'
  | 'ShoppingListSidebar'
  | 'StatsSidebar'
  | 'ToolbarSidebar'

/**
 * Parameters allowed to be passed to a component displayed in the global sidebar.
 */
export type GlobalSidebarDisplayedComponentParameters =
  BuildsExportSidebarParameters
  | BuildSidebarParameters
  | BuildsListSidebarParameters
  | BuildsShareSideBarParameters
  | GeneralOptionsSidebarParameters
  | ItemsListSidebarParameters
  | ShoppingListSidebarParameters
  | StatsSidebarParameters
  | ToolbarSidebarParameters

/**
 * Builds export sidebar parameters.
 */
export type BuildsExportSidebarParameters = IBuildSummary[]

/**
 * Share builds sidebar parameters.
 * Using buildsToShare immediatly display them in the share screen while using buildSummaries will display them in a BuildsList for the user to select the ones to share.
 */
export type BuildsShareSideBarParameters = {
  buildToShare?: IBuild,
  buildSummaries?: IBuildSummary[]
}

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

/**
 * Toolbar sidebar parameters.
 */
export type ToolbarSidebarParameters = IToolbarButton[]