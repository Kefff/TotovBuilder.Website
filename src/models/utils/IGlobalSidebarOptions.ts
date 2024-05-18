
/**
 * Provides the functionalities of options passed to the global sidebar when opening it.
 */
export interface IGlobalSidebarOptions {
  /**
   * Name of the component to display in the global sidebar.
   */
  displayedComponentType: 'GeneralOptions' | 'MerchantItemsOptions' | 'ShoppingList',

  /**
   * Parameters to pass as props to the component to display in the global sidebar.
   */
  displayedComponentParameters?: unknown

  /**
   * Position from which the global sidebar is displayed.
   */
  position: 'left' | 'right',
}