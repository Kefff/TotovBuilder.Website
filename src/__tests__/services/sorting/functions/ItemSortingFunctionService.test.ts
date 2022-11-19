import { spy, when } from 'ts-mockito'
import { IItem } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import SortingData, { SortingOrder } from '../../../../models/utils/SortingData'
import { InventoryItemService } from '../../../../services/InventoryItemService'
import { ItemService } from '../../../../services/ItemService'
import { MerchantFilterService } from '../../../../services/MerchantFilterService'
import Services from '../../../../services/repository/Services'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunction'
import { SortingService } from '../../../../services/sorting/SortingService'
import Result from '../../../../utils/Result'
import { useItemServiceMock } from '../../../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../../../__mocks__/WebsiteConfigurationServiceMock'

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

describe('compareByName()', () => {
  it.each([
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat2' } as IItem, -1],
    [{ name: 'a', categoryId: 'cat2' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'b', categoryId: 'cat1' } as IItem, -1],
    [{ name: 'b', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category and name', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Arrange
    const sortingService = new SortingService([new ItemSortingFunctions()])
    const sortingData = new SortingData()
    sortingData.property = 'invalid'

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty(sortingData, 'name')
    const value1 = updatedSortingDataResult.value.getValueToCompareFunction(item1) as string
    const value2 = updatedSortingDataResult.value.getValueToCompareFunction(item2) as string
    const sortingValue = updatedSortingDataResult.value.comparisonFunction(item1, value1, item2, value2)

    // Assert
    expect(updatedSortingDataResult.success).toBe(true)
    expect(updatedSortingDataResult.value.property).toBe('name')
    expect(updatedSortingDataResult.value.order).toBe(SortingOrder.asc)
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})

describe('compareByNumber()', () => {
  it.each([
    [{ name: 'a', categoryId: 'cat1', weight: 1 } as IItem, { name: 'a', categoryId: 'cat2', weight: 1 } as IItem, -1],
    [{ name: 'a', categoryId: 'cat2', weight: 1 } as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1', weight: 1 } as IItem, { name: 'a', categoryId: 'cat1', weight: 2 } as IItem, -1],
    [{ name: 'a', categoryId: 'cat1', weight: 2 } as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1', weight: 1 } as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as IItem, 0],
    [{ name: 'a', categoryId: 'cat1', weight: 1 } as IItem, { name: 'b', categoryId: 'cat1', weight: 1 } as IItem, -1],
    [{ name: 'b', categoryId: 'cat1', weight: 1 } as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as IItem, 1]
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
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(MerchantFilterService)

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
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(MerchantFilterService)

    const item1 = { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem
    const item2 = { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem

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
    [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, { name: 'a', categoryId: 'cat2', shortName: 'a' } as IItem, -1],
    [{ name: 'a', categoryId: 'cat2', shortName: 'a' } as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, { name: 'a', categoryId: 'cat1', shortName: 'b' } as IItem, -1],
    [{ name: 'a', categoryId: 'cat1', shortName: 'b' } as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, 0],
    [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, { name: 'b', categoryId: 'cat1', shortName: 'a' } as IItem, -1],
    [{ name: 'b', categoryId: 'cat1', shortName: 'a' } as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as IItem, 1]
  ])('should compare by category, a string property and name', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Act
    const sortingValue = ItemSortingFunctions.compareByString(item1, item1.shortName, item2, item2.shortName)

    // Assert
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})