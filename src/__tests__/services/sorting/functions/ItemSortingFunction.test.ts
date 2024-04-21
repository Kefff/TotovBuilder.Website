import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../../models/build/IInventoryItem'
import { IItem } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import { IInventoryItemPrice } from '../../../../models/utils/IInventoryItemPrice'
import SortingData, { SortingOrder } from '../../../../models/utils/SortingData'
import { InventoryItemService } from '../../../../services/InventoryItemService'
import Services from '../../../../services/repository/Services'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunction'
import Result from '../../../../utils/Result'

describe('comparisonFunction()', () => {
  it.each([
    [
      { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat2', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      -1
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat2', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      1
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as unknown as IItem,
      -1
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      1
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      0
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'b', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      -1
    ],
    [
      { id: 'i1', name: 'b', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      1
    ],
    [
      { id: 'i1', name: 'b', categoryId: 'cat1', prices: [] as IPrice[] } as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1', prices: [] as IPrice[] } as IItem,
      1
    ]
  ])('should compare by category, price and name', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const inventoryItemService = mock<InventoryItemService>()
    when(inventoryItemService.getPrice(anything())).thenCall((inventoryItem: IInventoryItem) => {
      return inventoryItem.itemId === item1.id
        ? Result.ok({ unitPrice: item1.prices[0] ?? { valueInMainCurrency: 0 } } as IInventoryItemPrice)
        : Result.ok({ unitPrice: item2.prices[0] ?? { valueInMainCurrency: 0 } } as IInventoryItemPrice)
    })
    Services.configure(InventoryItemService, undefined, instance(inventoryItemService))

    const sortingService = new SortingService(ItemSortingFunctions)

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty('price')
    const value1 = await updatedSortingDataResult.value.sortingFunction.comparisonValueObtentionFunction(item1)
    const value2 = await updatedSortingDataResult.value.sortingFunction.comparisonValueObtentionFunction(item2)
    const result = updatedSortingDataResult.value.sortingFunction.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('price')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(result).toBe(expectedComparisonValue)
  })

  it('should compare by category and price even when the price is not found', async () => {
    // Arrange
    const item1 = { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem
    const item2 = { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem

    const inventoryItemService = mock<InventoryItemService>()
    when(inventoryItemService.getPrice(anything())).thenResolve(Result.fail())
    Services.configure(InventoryItemService, undefined, instance(inventoryItemService))

    const sortingService = new SortingService(ItemSortingFunctions)

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty('price')
    const value1 = await updatedSortingDataResult.value.sortingFunction.comparisonValueObtentionFunction(item1)
    const value2 = await updatedSortingDataResult.value.sortingFunction.comparisonValueObtentionFunction(item2)
    const result = updatedSortingDataResult.value.sortingFunction.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('price')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(result).toBe(0)
  })

  it('should compare by a category', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat2',
      name: 'a'
    } as IItem

    const item2 = {
      categoryId: 'cat1',
      name: 'a'
    } as IItem

    const item3 = {
      categoryId: 'cat1',
      name: 'b'
    } as IItem

    const sortingService = new SortingService(ItemSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty('categoryId')

    // Act
    const sortedItems = await SortingService.sort([item1, item2, item3], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item3, item1])
  })

  it('should compare by category and a name', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat2',
      name: 'a'
    } as IItem

    const item2 = {
      categoryId: 'cat1',
      name: 'a'
    } as IItem

    const item3 = {
      categoryId: 'cat1',
      name: 'b'
    } as IItem

    const sortingService = new SortingService(ItemSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty('name')

    // Act
    const sortedItems = await SortingService.sort([item1, item2, item3], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item1, item3, item2]) // By default it is already sorted by name, so here we expected items to be sorted in a descending way
  })
})

describe('defaultSortingFunction', () => {
  it('should compare by name', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      name: 'b'
    } as IItem

    const item2 = {
      categoryId: 'cat',
      name: 'a'
    } as IItem

    const sortingData = new SortingData<IItem>()
    const comparisonValue1 = await sortingData.sortingFunction.comparisonValueObtentionFunction(item1)
    const comparisonValue2 = await sortingData.sortingFunction.comparisonValueObtentionFunction(item2)

    // Act
    const result = sortingData.sortingFunction.comparisonFunction(item1, comparisonValue1, item2, comparisonValue2)

    // Assert
    expect(result).toStrictEqual(1)
  })
})