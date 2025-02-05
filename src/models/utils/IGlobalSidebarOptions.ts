import { IBuild } from '../build/IBuild'
import { InventorySlotTypeId } from '../build/InventorySlotTypes'
import { IShoppingListItem } from '../build/IShoppingListItem'
import { IItem } from '../item/IItem'
import BuildFilterAndSortingData from './BuildFilterAndSortingData'
import { IGeneralOptionsGroup } from './IGeneralOptionsGroup'
import ItemFilterAndSortingData from './ItemFilterAndSortingData'
import { IToolbarButton } from './IToolbarButton'

/**
 * Provides the functionalities of options passed to the global sidebar when opening it.
 */
export interface IGlobalSidebarOptions {
  /**
   * Parameters to pass as props to the component to display in the global sidebar.
   */
  displayedComponentParameters?: GlobalSidebarDisplayedComponentParameters

  /**
   * Name of the component to display in the global sidebar.
   */
  displayedComponentType: GlobalSidebarComponent

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
  | 'InventorySlotSelectorSidebar'
  | 'ItemSelectionSidebar'
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
  | InventorySlotSelectorSidebarParameters
  | ItemSelectionSidebarParameters
  | ItemsListSidebarParameters
  | ShoppingListSidebarParameters
  | StatsSidebarParameters
  | ToolbarSidebarParameters

/**
 * Builds export sidebar parameters.
 */
export type BuildsExportSidebarParameters = {
  /**
   * Function for getting the builds the user can export.
   */
  getBuildsToExportFunction: () => IBuild[],
}

/**
 * Share builds sidebar parameters.
 */
export type BuildsShareSideBarParameters = {
  /**
   * Build to share sharing directly from a build (no selection screen).
   */
  buildToShare?: IBuild
  /**
   * Function for getting the builds the user can share from a selection screen.
   */
  getBuildsToShareFunction?: () => IBuild[]
}

/**
 * Inventory slot selector sidebar parameters.
 */
export type InventorySlotSelectorSidebarParameters = InventorySlotTypeId

/**
 * Item selection sidebar parameters.
 */
export type ItemSelectionSidebarParameters = {
  /**
   * Data for filtering and sorting the items the user can select.
   */
  filterAndSortingData: ItemFilterAndSortingData | undefined,

  /**
   * Function for getting the items the user can select.
   */
  getSelectableItemsFunction: () => Promise<IItem[]>,

  /**
   * Items that appear as selected when the sidebar is displayed.
   */
  selectedItems: IItem[],
}

/**
 * Shopping list sidebar parameters.
 */
export type ShoppingListSidebarParameters = {
  /**
   * Name of the build for which the shopping list is displayed.
   */
  buildName: string,

  /**
   * Shopping list.
   */
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