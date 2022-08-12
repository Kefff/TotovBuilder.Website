import { spy, when } from 'ts-mockito'
import { IItem } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import SortingData, { SortingOrder } from '../../../../models/utils/SortingData'
import { ItemService } from '../../../../services/ItemService'
import Services from '../../../../services/repository/Services'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunction'
import { SortingService } from '../../../../services/sorting/SortingService'
import Result from '../../../../utils/Result'

describe('compareByCategory()', () => {
  it.each([
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat2' } as IItem, -1],
    [{ categoryId: 'cat2' } as IItem, { categoryId: 'cat1' } as IItem, 1],
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const sortingService = new SortingService([new ItemSortingFunctions()])
    const sortingData = new SortingData()

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty(sortingData, 'categoryId')
    const value1 = updatedSortingDataResult.value.getValueToCompareFunction(item1) as string
    const value2 = updatedSortingDataResult.value.getValueToCompareFunction(item2) as string
    const sortingValue = updatedSortingDataResult.value.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('categoryId')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})

describe('compareByCaption()', () => {
  it.each([
    [{ caption: 'a', categoryId: 'cat1' } as IItem, { caption: 'a', categoryId: 'cat2' } as IItem, -1],
    [{ caption: 'a', categoryId: 'cat2' } as IItem, { caption: 'a', categoryId: 'cat1' } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1' } as IItem, { caption: 'b', categoryId: 'cat1' } as IItem, -1],
    [{ caption: 'b', categoryId: 'cat1' } as IItem, { caption: 'a', categoryId: 'cat1' } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1' } as IItem, { caption: 'a', categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category and caption', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const sortingService = new SortingService([new ItemSortingFunctions()])
    const sortingData = new SortingData()
    sortingData.property = 'invalid'

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty(sortingData, 'caption')
    const value1 = updatedSortingDataResult.value.getValueToCompareFunction(item1) as string
    const value2 = updatedSortingDataResult.value.getValueToCompareFunction(item2) as string
    const sortingValue = updatedSortingDataResult.value.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('caption')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})

describe('compareByNumber()', () => {
  it.each([
    [{ caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, { caption: 'a', categoryId: 'cat2', weight: 1 } as IItem, -1],
    [{ caption: 'a', categoryId: 'cat2', weight: 1 } as IItem, { caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, { caption: 'a', categoryId: 'cat1', weight: 2 } as IItem, -1],
    [{ caption: 'a', categoryId: 'cat1', weight: 2 } as IItem, { caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, { caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, 0],
    [{ caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, { caption: 'b', categoryId: 'cat1', weight: 1 } as IItem, -1],
    [{ caption: 'b', categoryId: 'cat1', weight: 1 } as IItem, { caption: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1]
  ])('should compare by category, a number property and caption', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Act
    const sortingValue = ItemSortingFunctions.compareByNumber(item1, item1.weight, item2, item2.weight)

    // Assert
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})

describe('compareByPrice()', () => {
  it.each([
    [
      { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat2', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      -1
    ],
    [
      { id: 'i1', caption: 'a', categoryId: 'cat2', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      1
    ],
    [
      { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem,
      -1
    ],
    [
      { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      1
    ],
    [
      { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      0
    ],
    [
      { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'b', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      -1
    ],
    [
      { id: 'i1', caption: 'b', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem,
      1
    ],
    [
      { id: 'i1', caption: 'b', categoryId: 'cat1', prices: [] as IPrice[] } as IItem,
      { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [] as IPrice[] } as IItem,
      1
    ]
  ])('should compare by category, price and caption', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const itemServiceSpy = spy(Services.get(ItemService))
    when(itemServiceSpy.getItem(item1.id)).thenReturn(Promise.resolve(Result.ok(item1)))
    when(itemServiceSpy.getItem(item2.id)).thenReturn(Promise.resolve(Result.ok(item2)))

    const sortingService = new SortingService([new ItemSortingFunctions()])
    const sortingData = new SortingData()

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty(sortingData, 'price')
    const value1 = await updatedSortingDataResult.value.getValueToCompareFunction(item1)
    const value2 = await updatedSortingDataResult.value.getValueToCompareFunction(item2)
    const result = updatedSortingDataResult.value.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('price')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(result).toBe(expectedComparisonValue)
  })

  it('should compare by category and price even when the price is not found', async () => {
    // Arrange
    const item1 = { id: 'i1', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem
    const item2 = { id: 'i2', caption: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem

    const itemServiceSpy = spy(Services.get(ItemService))
    when(itemServiceSpy.getItem(item1.id)).thenReturn(Promise.resolve(Result.fail()))
    when(itemServiceSpy.getItem(item2.id)).thenReturn(Promise.resolve(Result.fail()))

    const sortingService = new SortingService([new ItemSortingFunctions()])
    const sortingData = new SortingData()

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty(sortingData, 'price')
    const value1 = await updatedSortingDataResult.value.getValueToCompareFunction(item1)
    const value2 = await updatedSortingDataResult.value.getValueToCompareFunction(item2)
    const result = updatedSortingDataResult.value.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('price')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(result).toBe(0)
  })
})

describe('compareByString()', () => {
  it.each([
    [{ caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, { caption: 'a', categoryId: 'cat2', name: 'a' } as IItem, -1],
    [{ caption: 'a', categoryId: 'cat2', name: 'a' } as IItem, { caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, { caption: 'a', categoryId: 'cat1', name: 'b' } as IItem, -1],
    [{ caption: 'a', categoryId: 'cat1', name: 'b' } as IItem, { caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, 1],
    [{ caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, { caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, 0],
    [{ caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, { caption: 'b', categoryId: 'cat1', name: 'a' } as IItem, -1],
    [{ caption: 'b', categoryId: 'cat1', name: 'a' } as IItem, { caption: 'a', categoryId: 'cat1', name: 'a' } as IItem, 1]
  ])('should compare by category, a string property and caption', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Act
    const sortingValue = ItemSortingFunctions.compareByString(item1, item1.name, item2, item2.name)

    // Assert
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})