import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import { IInventoryItemPrice } from '../../../../models/utils/IInventoryItemPrice'
import { IgnoredUnitPrice } from '../../../../models/utils/IgnoredUnitPrice'
import SortingData from '../../../../models/utils/SortingData'
import { SortingOrder } from '../../../../models/utils/SortingOrder'
import { InventoryItemService } from '../../../../services/InventoryItemService'
import Services from '../../../../services/repository/Services'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    [
      { id: 'i1', name: 'a', categoryId: 'cat1' as unknown as ItemCategoryId, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat2' as unknown as ItemCategoryId, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      0
    ],
    [
      { id: 'i1', name: 'a', categoryId: 'cat2' as unknown as ItemCategoryId, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: 'cat1' as unknown as ItemCategoryId, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      0
    ],
    [
      { id: 'i1', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as unknown as IItem,
      -1
    ],
    [
      { id: 'i1', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      1
    ],
    [
      { id: 'i1', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      0
    ],
    [
      { id: 'i1', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'b', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      -1
    ],
    [
      { id: 'i1', name: 'b', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [{ barterItems: [], currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as unknown as IItem,
      1
    ],
    [
      { id: 'i1', name: 'b', categoryId: ItemCategoryId.other, prices: [] as IPrice[] } as IItem,
      { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [] as IPrice[] } as IItem,
      1
    ]
  ])('should sort by category, price and name', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const inventoryItemService = mock<InventoryItemService>()
    when(inventoryItemService.getPriceAsync(anything())).thenCall((inventoryItem: IInventoryItem) => {
      return inventoryItem.itemId === item1.id
        ? { unitPrice: item1.prices[0] ?? { valueInMainCurrency: 0 } } as IInventoryItemPrice
        : { unitPrice: item2.prices[0] ?? { valueInMainCurrency: 0 } } as IInventoryItemPrice
    })
    Services.configure(InventoryItemService, undefined, instance(inventoryItemService))

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()

    // Act
    sortingData = sortingService.setSortingProperty(sortingData, ItemSortingFunctions, 'price')
    const value1 = await sortingData!.sortingFunction.comparisonValueObtentionPromise(item1)
    const value2 = await sortingData!.sortingFunction.comparisonValueObtentionPromise(item2)
    const result = sortingData!.sortingFunction.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(sortingData!.property).toBe('price')
    expect(sortingData!.order).toBe(SortingOrder.asc)
    expect(result).toBe(expectedComparisonValue)
  })

  it('should sort by category and price even when the price is not found', async () => {
    // Arrange
    const item1 = { id: 'i1', name: 'a', categoryId: ItemCategoryId.other, prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem
    const item2 = { id: 'i2', name: 'a', categoryId: ItemCategoryId.other, prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem

    const inventoryItemService = mock<InventoryItemService>()
    when(inventoryItemService.getPriceAsync(anything())).thenResolve({
      missingPrice: false,
      price: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      priceWithContentInMainCurrency: 0,
      unitPrice: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    })
    Services.configure(InventoryItemService, undefined, instance(inventoryItemService))

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()

    // Act
    sortingData = sortingService.setSortingProperty(sortingData, ItemSortingFunctions, 'price')
    const value1 = await sortingData!.sortingFunction.comparisonValueObtentionPromise(item1)
    const value2 = await sortingData!.sortingFunction.comparisonValueObtentionPromise(item2)
    const result = sortingData!.sortingFunction.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(sortingData!.property).toBe('price')
    expect(sortingData!.order).toBe(SortingOrder.asc)
    expect(result).toBe(0)
  })

  it('should sort by category', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat2' as unknown as ItemCategoryId,
      name: 'a'
    } as IItem

    const item2 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'a'
    } as IItem

    const item3 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'b'
    } as IItem

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ItemSortingFunctions, 'categoryId')

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2, item3], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item3, item1])
  })

  it('should sort by name', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat2' as unknown as ItemCategoryId,
      name: 'a'
    } as IItem

    const item2 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'b'
    } as IItem

    const item3 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'a'
    } as IItem

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ItemSortingFunctions, 'name')

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2, item3], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1, item3]) // By default it is already sorted by name, so here we expected items to be sorted in a descending way
  })

  it('should sort by weight', async () => {
    // Arrange
    const item1 = {
      categoryId: 'cat2' as unknown as ItemCategoryId,
      name: 'a',
      weight: 2
    } as IItem

    const item2 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'a',
      weight: 3
    } as IItem

    const item3 = {
      categoryId: 'cat1' as unknown as ItemCategoryId,
      name: 'b',
      weight: 1
    } as IItem

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ItemSortingFunctions, 'weight')

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2, item3], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item3, item1, item2])
  })
})

describe('defaultSortingFunction', () => {
  it('should sort by name', async () => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.other,
      name: 'b'
    } as IItem

    const item2 = {
      categoryId: ItemCategoryId.other,
      name: 'a'
    } as IItem

    const sortingData = new SortingData()
    const comparisonValue1 = await sortingData.sortingFunction.comparisonValueObtentionPromise(item1)
    const comparisonValue2 = await sortingData.sortingFunction.comparisonValueObtentionPromise(item2)

    // Act
    const result = sortingData.sortingFunction.comparisonFunction(item1, comparisonValue1, item2, comparisonValue2)

    // Assert
    expect(result).toStrictEqual(1)
  })
})