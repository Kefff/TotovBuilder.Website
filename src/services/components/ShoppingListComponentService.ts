import { TinyEmitter } from 'tiny-emitter'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'

/**
 * Represents a service responsible for managing a ShoppingListComponent.
 */
export class ShoppingListComponentService {
  /**
   * Name of the event fired to ask the shopping list to open.
   */
  public static openShoppingListEvent = 'openShoppingList'

  /**
   * Event emitter used to initialization state change.
   */
  public emitter = new TinyEmitter()

  /**
   * Displays the shopping list.
   * @param shoppingList - Shopping list to display.
   */
  public display(shoppingList: IShoppingListItem[]) {
    this.emitter.emit(ShoppingListComponentService.openShoppingListEvent, shoppingList)
  }
}