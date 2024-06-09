import { anything, instance, mock, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IItem } from '../../../models/item/IItem'
import SortingData, { SortingOrder } from '../../../models/utils/SortingData'
import { LogService } from '../../../services/LogService'
import Services from '../../../services/repository/Services'
import { SortingService, compareByCategory, compareByName, compareByNumber, compareByString } from '../../../services/sorting/SortingService'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'

describe('compareByCategory()', () => {
  it.each([
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat2' } as IItem, -1],
    [{ categoryId: 'cat2' } as IItem, { categoryId: 'cat1' } as IItem, 1],
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Act
    const result = compareByCategory(item1, item2)

    // Assert
    expect(result).toBe(expectedComparisonValue)
  })
})

describe('compareByName()', () => {
  it.each([
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat2' } as IItem, 0],
    [{ name: 'a', categoryId: 'cat2' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 0],
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'b', categoryId: 'cat1' } as IItem, -1],
    [{ name: 'b', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 1],
    [{ name: 'a', categoryId: 'cat1' } as IItem, { name: 'a', categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category and name', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
    // Act
    const result = compareByName(item1, item2)

    // Assert
    expect(result).toBe(expectedComparisonValue)
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
    const sortingValue = compareByNumber(item1, item1.weight, item2, item2.weight)

    // Assert
    expect(sortingValue).toBe(expectedComparisonValue)
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
    const sortingValue = compareByString(item1, item1.shortName, item2, item2.shortName)

    // Assert
    expect(sortingValue).toBe(expectedComparisonValue)
  })
})

describe('setSortingProperty()', () => {
  it.each([
    ['name', SortingOrder.desc, -1],
    ['price', SortingOrder.asc, 2]
  ])('should set the sorting property and get the comparison function', (property: string, expectedSortingOrder: SortingOrder, expectedComparisonResult: number) => {
    // Arrange
    let sortingData: SortingData | undefined = new SortingData()
    const sortingFunctions: ISortingFunctionList = {
      name: {
        comparisonFunction: () => {
          return 1
        },
        comparisonValueObtentionFunction: (item: IItem) => Promise.resolve(item.name)
      },
      price: {
        comparisonFunction: () => 2,
        comparisonValueObtentionFunction: (item: IItem) => Promise.resolve(item.prices[0].valueInMainCurrency)
      }
    }
    const sortService = new SortingService()

    // Act
    sortingData = sortService.setSortingProperty(sortingData, sortingFunctions, property)
    const comparison = sortingData!.sortingFunction.comparisonFunction({} as IItem, 0, {} as IItem, 0)

    // Assert
    expect(sortingData!.property).toBe(property)
    expect(sortingData!.order).toBe(expectedSortingOrder)
    expect(comparison).toBe(expectedComparisonResult)
  })

  it('should return undefined when no comparison function is configured for the property', () => {
    // Arrange
    let sortingData: SortingData | undefined = new SortingData()
    const sortingFunctions: ISortingFunctionList = {}
    const sortService = new SortingService()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    // Act
    sortingData = sortService.setSortingProperty(sortingData, sortingFunctions, 'invalid')

    // Assert
    expect(sortingData).toBe(undefined)
    verify(logServiceMock.logError('message.sortingFunctionNotFound', anything())).once()
  })
})

describe('sort()', () => {
  it('should sort an array or items', async () => {
    // Arrange
    let sortingData: SortingData | undefined = new SortingData()
    const sortingFunctions: ISortingFunctionList = {
      shortName: {
        comparisonFunction: compareByString,
        comparisonValueObtentionFunction: (item: IItem) => Promise.resolve(item.shortName)
      }
    }
    const items = [
      { categoryId: 'cat1', shortName: 'e' } as IItem,
      { categoryId: 'cat2', shortName: 'f' } as IItem,
      { categoryId: 'cat1', shortName: 'b' } as IItem,
      { categoryId: 'cat1', shortName: 'f' } as IItem,
      { categoryId: 'cat1', shortName: 'i' } as IItem
    ]
    const sortingService = new SortingService()

    // Act
    sortingData = sortingService.setSortingProperty(sortingData, sortingFunctions, 'shortName')
    const result = await sortingService.sort(items, sortingData!)

    // Assert
    expect(result).toStrictEqual([
      { categoryId: 'cat1', shortName: 'b' } as IItem,
      { categoryId: 'cat1', shortName: 'e' } as IItem,
      { categoryId: 'cat1', shortName: 'f' } as IItem,
      { categoryId: 'cat1', shortName: 'i' } as IItem,
      { categoryId: 'cat2', shortName: 'f' } as IItem
    ])
  })
})