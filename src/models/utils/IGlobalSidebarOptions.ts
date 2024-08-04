import { IShoppingListItem } from '../build/IShoppingListItem'
import { IItem } from '../item/IItem'
import BuildFilterAndSortingData from './BuildFilterAndSortingData'
import { IGeneralOptionsGroup } from './IGeneralOptionsGroup'

/**
 * Provides the functionalities of options passed to the global sidebar when opening it.
 */
export interface IGlobalSidebarOptions {
  /**
   * Name of the component to display in the global sidebar.
   */
  displayedComponentType: GlobalSidebarComponentType

  /**
   * Parameters to pass as props to the component to display in the global sidebar.
   */
  displayedComponentParameters?: GlobalSidebarDisplayedComponentParametersType

  /**
   * Action to execute when the sidebar is closed.
   * @param updatedParameters - Parameters with updated values if the opened sidebar has changed them.
   */
  onCloseAction?: (updatedParameters?: GlobalSidebarDisplayedComponentParametersType) => void | Promise<void>

  /**
   * Position from which the global sidebar is displayed.
   */
  position: GlobalSidebarPosition,
}

/**
 * Type component to display in a global sidebar.
 */
export type GlobalSidebarComponentType =
  'BuildsListSidebar'
  | 'ChangelogSidebar'
  | 'GeneralOptionsSidebar'
  | 'MerchantItemsOptionsSidebar'
  | 'NotificationsSidebar'
  | 'ShoppingListSidebar'
  | 'StatsSidebar'

/**
 * Type of parameters allowed to be passed to a component displayed in the global sidebar.
 */
export type GlobalSidebarDisplayedComponentParametersType =
  BuildFilterAndSortingData
  | IGeneralOptionsGroup[]
  | IItem
  | IShoppingListItem[]

/**
 * Position of a global sidebar.
 */
export type GlobalSidebarPosition = 'left' | 'right'