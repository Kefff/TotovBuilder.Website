import { spy, when } from 'ts-mockito'
import { IItem } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import SortingData, { SortingOrder } from '../../../../models/utils/SortingData'
import { InventoryItemService } from '../../../../services/InventoryItemService'
import { ItemService } from '../../../../services/ItemService'
import { GlobalFilterService } from '../../../../services/GlobalFilterService'
import Services from '../../../../services/repository/Services'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunction'
import { SortingService } from '../../../../services/sorting/SortingService'
import Result from '../../../../utils/Result'
import { useItemServiceMock } from '../../../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../../../__mocks__/WebsiteConfigurationServiceMock'
import { usePresetServiceMock } from '../../../../__mocks__/PresetPropertiesServiceMock'

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
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)

    const itemServiceSpy = spy(Services.get(ItemService))
    when(itemServiceSpy.getItem(item1.id)).thenReturn(Promise.resolve(Result.ok(item1)))
    when(itemServiceSpy.getItem(item2.id)).thenReturn(Promise.resolve(Result.ok(item2)))

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
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)

    const item1 = { id: 'i1', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 1, valueInMainCurrency: 1 }] } as IItem
    const item2 = { id: 'i2', name: 'a', categoryId: 'cat1', prices: [{ currencyName: 'RUB', merchant: 'prapor', merchantLevel: 1, value: 2, valueInMainCurrency: 2 }] } as IItem

    const itemServiceSpy = spy(Services.get(ItemService))
    when(itemServiceSpy.getItem(item1.id)).thenReturn(Promise.resolve(Result.fail()))
    when(itemServiceSpy.getItem(item2.id)).thenReturn(Promise.resolve(Result.fail()))

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
    Services.configure(InventoryItemService)

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
    Services.configure(InventoryItemService)

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