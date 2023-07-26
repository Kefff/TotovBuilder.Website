import { IItem } from '../../../models/item/IItem'
import { SortingService, compareByCategory, compareByName, compareByNumber, compareByString } from '../../../services/sorting/SortingService'
import { SortingOrder } from '../../../models/utils/SortingData'
import { describe, expect, it } from 'vitest'

describe('compareByCategory()', () => {
  it.each([
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat2' } as IItem, -1],
    [{ categoryId: 'cat2' } as IItem, { categoryId: 'cat1' } as IItem, 1],
    [{ categoryId: 'cat1' } as IItem, { categoryId: 'cat1' } as IItem, 0]
  ])('it should compare by category', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
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
  ])('it should compare by category and name', async (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
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
  ])('should set the sorting property and get the comparison function', async (property: string, expectedSortingOrder: SortingOrder, expectedComparisonResult: number) => {
    // Arrange
    const sortService = new SortingService({
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
    })

    // Act
    const sortingDataResult = sortService.setSortingProperty(property)
    const comparisonResult = sortingDataResult.value.sortingFunction.comparisonFunction({} as IItem, 0, {} as IItem, 0)

    // Assert
    expect(sortingDataResult.success).toBe(true)
    expect(sortingDataResult.value.property).toBe(property)
    expect(sortingDataResult.value.order).toBe(expectedSortingOrder)
    expect(comparisonResult).toBe(expectedComparisonResult)
  })

  it('should fail when no comparison function is configured for the property', () => {
    // Arrange
    const sortService = new SortingService({})

    // Act
    const sortingDataResult = sortService.setSortingProperty('invalid')

    // Assert
    expect(sortingDataResult.success).toBe(false)
    expect(sortingDataResult.failureMessage).toBe('Sorting function for property "invalid" not found.')
  })
})

describe('sort()', () => {
  it('should sort an array or items', async () => {
    // Arrange
    const items = [
      { categoryId: 'cat1', shortName: 'e' } as IItem,
      { categoryId: 'cat2', shortName: 'f' } as IItem,
      { categoryId: 'cat1', shortName: 'b' } as IItem,
      { categoryId: 'cat1', shortName: 'f' } as IItem,
      { categoryId: 'cat1', shortName: 'i' } as IItem
    ]
    const sortingService = new SortingService({
      shortName: {
        comparisonFunction: compareByString,
        comparisonValueObtentionFunction: (item: IItem) => Promise.resolve(item.shortName)
      }
    })

    // Act
    const updatedSortingDataResult = sortingService.setSortingProperty('shortName')
    const result = await SortingService.sort(items, updatedSortingDataResult.value)

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