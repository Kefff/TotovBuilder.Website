import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../../models/build/IInventoryItem'
import { IBarterItem } from '../../../../models/item/IBarterItem'
import { IItem, ItemCategoryId } from '../../../../models/item/IItem'
import { IPrice } from '../../../../models/item/IPrice'
import { IInventoryItemPrice } from '../../../../models/utils/IInventoryItemPrice'
import { IgnoredUnitPrice } from '../../../../models/utils/IgnoredUnitPrice'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../../../models/utils/SortingOrder'
import { InventoryItemService } from '../../../../services/InventoryItemService'
import Services from '../../../../services/repository/Services'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ItemSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'
import { mts25512wood } from '../../../__data__/itemMocks'
import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'

describe('comparisonFunction', () => {
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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'price'

    // Act
    const value1 = await sortingData!.currentSortingFunction.comparisonValueObtentionPromise(item1)
    const value2 = await sortingData!.currentSortingFunction.comparisonValueObtentionPromise(item2)
    const result = sortingData!.currentSortingFunction.comparisonFunction(item1, value1, item2, value2)

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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'price'

    // Act
    const value1 = await sortingData!.currentSortingFunction.comparisonValueObtentionPromise(item1)
    const value2 = await sortingData!.currentSortingFunction.comparisonValueObtentionPromise(item2)
    const result = sortingData!.currentSortingFunction.comparisonFunction(item1, value1, item2, value2)

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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'categoryId'

    const sortingService = new SortingService()

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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'name'

    const sortingService = new SortingService()

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2, item3], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1, item3]) // By default it is already sorted by name, so here we expected items to be sorted in a descending way
  })

  it('should sort by price and group barters with missing prices and prices with a currency without value', async () => {
    // Arrange
    const itemWithMissingBarterPrices1 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithMissingBarterPrices1',
      name: 'itemWithMissingBarterPrices1'
    } as IItem

    const itemWithMissingBarterPrices2 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithMissingBarterPrices2',
      name: 'itemWithMissingBarterPrices2'
    } as IItem

    const itemWithCurrencyWithoutValue1_1 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithCurrencyWithoutValue1_1',
      name: 'itemWithCurrencyWithoutValue1_1'
    } as IItem

    const itemWithCurrencyWithoutValue1_2 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithCurrencyWithoutValue1_2',
      name: 'itemWithCurrencyWithoutValue1_2'
    } as IItem

    const itemWithCurrencyWithoutValue2_1 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithCurrencyWithoutValue2_1',
      name: 'itemWithCurrencyWithoutValue2_1'
    } as IItem

    const itemWithCurrencyWithoutValue2_2 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithCurrencyWithoutValue2_2',
      name: 'itemWithCurrencyWithoutValue2_2'
    } as IItem

    const itemWithPrice1 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithPrice1',
      name: 'itemWithPrice1'
    } as IItem

    const itemWithPrice2 = {
      categoryId: ItemCategoryId.armor,
      id: 'itemWithPrice2',
      name: 'itemWithPrice2'
    } as IItem

    useWebsiteConfigurationServiceMock()
    useTarkovValuesServiceMock()
    useItemServiceMock(
      true,
      [
        itemWithCurrencyWithoutValue1_1,
        itemWithCurrencyWithoutValue1_2,
        itemWithCurrencyWithoutValue2_1,
        itemWithCurrencyWithoutValue2_2,
        itemWithMissingBarterPrices1,
        itemWithMissingBarterPrices2,
        itemWithPrice1,
        itemWithPrice2
      ],
      [
        {
          barterItems: [
            {
              itemId: mts25512wood.id,
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: itemWithMissingBarterPrices1.id,
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          barterItems: [
            {
              itemId: mts25512wood.id,
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: itemWithMissingBarterPrices2.id,
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'GPCOIN',
          itemId: itemWithCurrencyWithoutValue1_1.id,
          merchant: 'ref',
          merchantLevel: 1,
          quest: undefined,
          value: 6,
          valueInMainCurrency: 0
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'GPCOIN',
          itemId: itemWithCurrencyWithoutValue1_2.id,
          merchant: 'ref',
          merchantLevel: 1,
          quest: undefined,
          value: 12,
          valueInMainCurrency: 0
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'TOTOCOIN',
          itemId: itemWithCurrencyWithoutValue2_1.id,
          merchant: 'ref',
          merchantLevel: 1,
          quest: undefined,
          value: 5,
          valueInMainCurrency: 0
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'TOTOCOIN',
          itemId: itemWithCurrencyWithoutValue2_2.id,
          merchant: 'ref',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 0
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'RUB',
          itemId: itemWithPrice1.id,
          merchant: 'ragman',
          merchantLevel: 1,
          quest: undefined,
          value: 10000,
          valueInMainCurrency: 10000
        },
        {
          barterItems: [] as IBarterItem[],
          currencyName: 'RUB',
          itemId: itemWithPrice2.id,
          merchant: 'ragman',
          merchantLevel: 1,
          quest: undefined,
          value: 20000,
          valueInMainCurrency: 20000
        }
      ])

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'price'

    const sortingService = new SortingService()

    // Act
    const sortedItems = await sortingService.sortAsync(
      [
        itemWithCurrencyWithoutValue2_1,
        itemWithPrice2,
        itemWithCurrencyWithoutValue2_2,
        itemWithMissingBarterPrices2,
        itemWithCurrencyWithoutValue1_2,
        itemWithPrice1,
        itemWithCurrencyWithoutValue1_1,
        itemWithMissingBarterPrices1
      ],
      sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([
      itemWithMissingBarterPrices1,
      itemWithMissingBarterPrices2,
      itemWithCurrencyWithoutValue1_1,
      itemWithCurrencyWithoutValue1_2,
      itemWithCurrencyWithoutValue2_1,
      itemWithCurrencyWithoutValue2_2,
      itemWithPrice1,
      itemWithPrice2
    ])
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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    sortingData.property = 'weight'

    const sortingService = new SortingService()

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

    const sortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
    const comparisonValue1 = await sortingData.currentSortingFunction.comparisonValueObtentionPromise(item1)
    const comparisonValue2 = await sortingData.currentSortingFunction.comparisonValueObtentionPromise(item2)

    // Act
    const result = sortingData.currentSortingFunction.comparisonFunction(item1, comparisonValue1, item2, comparisonValue2)

    // Assert
    expect(result).toStrictEqual(1)
  })
})