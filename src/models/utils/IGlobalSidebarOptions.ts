import { IShoppingListItem } from '../build/IShoppingListItem'
import { IItem } from '../item/IItem'
import { BuildFilterAndSortingData } from './BuildFilterAndSortingData'
import { IGeneralOptionsGroup } from './IGeneralOptionsGroup'

/**
 * Provides the functionalities of options passed to the global sidebar when opening it.
 */
export interface IGlobalSidebarOptions {
  /**
   * Name of the component to display in the global sidebar.
   */
  displayedComponentType:
  'BuildsListSidebar'
  | 'ChangelogSidebar'
  | 'GeneralOptionsSidebar'
  | 'MerchantItemsOptionsSidebar'
  | 'NotificationsSidebar'
  | 'ShoppingListSidebar'
  | 'StatsSidebar'

  /**
   * Parameters to pass as props to the component to display in the global sidebar.
   */
  displayedComponentParameters?: GlobalSidebarDisplayedComponentParametersType

  /**
   * Position from which the global sidebar is displayed.
   */
  position: 'left' | 'right',
}

/**
 * Type of parameters allowed to be passed to a component displayed in the global sidebar.
 */
export type GlobalSidebarDisplayedComponentParametersType =
  BuildFilterAndSortingData
  | IGeneralOptionsGroup[]
  | IItem
  | IShoppingListItem[]