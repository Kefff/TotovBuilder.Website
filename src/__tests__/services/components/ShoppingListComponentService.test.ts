import { describe, expect, it } from 'vitest'
import { IShoppingListItem } from '../../../models/build/IShoppingListItem'
import { ShoppingListComponentService } from '../../../services/components/ShoppingListComponentService'
import { rpk16Default } from '../../__data__/itemMocks'

describe('display()', () => {
  it('should emit the open shopping list event', () => {
    // Arrange
    const shoppingListToDisplay: IShoppingListItem[] = [
      {
        inventorySlotId: 'onSling',
        item: rpk16Default,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: rpk16Default.id,
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: undefined,
          value: 43345,
          valueInMainCurrency: 43345
        },
        quantity: 1,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: rpk16Default.id,
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: undefined,
          value: 43345,
          valueInMainCurrency: 43345
        }
      }
    ]
    let displayedShoppingList: IShoppingListItem[] | undefined = undefined
    const service = new ShoppingListComponentService()

    service.emitter.once(ShoppingListComponentService.openShoppingListEvent, (sl: IShoppingListItem[]) => displayedShoppingList = sl)

    // Act
    service.display(shoppingListToDisplay)

    // Assert
    expect(displayedShoppingList).toStrictEqual(shoppingListToDisplay)
  })
})