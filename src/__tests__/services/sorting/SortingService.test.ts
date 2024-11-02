import { anything, instance, mock, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import SortingData from '../../../models/utils/SortingData'
import { SortingOrder } from '../../../models/utils/SortingOrder'
import { LogService } from '../../../services/LogService'
import Services from '../../../services/repository/Services'
import { SortingService, compareByElementName, compareByItemNumber, compareByItemString, compareByNumber } from '../../../services/sorting/SortingService'
import { IBuildSortingFunctionList, IItemSortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'

describe('SortingService', () => {
  describe('compareByElementName()', () => {
    it.each([
      [{ name: 'a', categoryId: 'cat1' }, { name: 'a', categoryId: 'cat2' }, 0],
      [{ name: 'a', categoryId: 'cat2' }, { name: 'a', categoryId: 'cat1' }, 0],
      [{ name: 'a', categoryId: 'cat1' }, { name: 'b', categoryId: 'cat1' }, -1],
      [{ name: 'b', categoryId: 'cat1' }, { name: 'a', categoryId: 'cat1' }, 1],
      [{ name: 'a', categoryId: 'cat1' }, { name: 'a', categoryId: 'cat1' }, 0]
    ])('it should compare by category and name', (element1: Record<string, unknown>, element2: Record<string, unknown>, expectedComparisonValue: number) => {
      // Act
      const result = compareByElementName(element1, element2)

      // Assert
      expect(result).toBe(expectedComparisonValue)
    })
  })

  describe('compareByItemNumber()', () => {
    it.each([
      [{ name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, { name: 'a', categoryId: 'cat2', weight: 1 } as unknown as IItem, -1],
      [{ name: 'a', categoryId: 'cat2', weight: 1 } as unknown as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, 1],
      [{ name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, { name: 'a', categoryId: 'cat1', weight: 2 } as unknown as IItem, -1],
      [{ name: 'a', categoryId: 'cat1', weight: 2 } as unknown as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, 1],
      [{ name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, 0],
      [{ name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, { name: 'b', categoryId: 'cat1', weight: 1 } as unknown as IItem, -1],
      [{ name: 'b', categoryId: 'cat1', weight: 1 } as unknown as IItem, { name: 'a', categoryId: 'cat1', weight: 1 } as unknown as IItem, 1]
    ])('should compare by category, a number property and caption', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
      // Act
      const sortingValue = compareByItemNumber(item1, item1.weight, item2, item2.weight)

      // Assert
      expect(sortingValue).toBe(expectedComparisonValue)
    })
  })

  describe('compareByItemString()', () => {
    it.each([
      [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, { name: 'a', categoryId: 'cat2', shortName: 'a' } as unknown as IItem, -1],
      [{ name: 'a', categoryId: 'cat2', shortName: 'a' } as unknown as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, 1],
      [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, { name: 'a', categoryId: 'cat1', shortName: 'b' } as unknown as IItem, -1],
      [{ name: 'a', categoryId: 'cat1', shortName: 'b' } as unknown as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, 1],
      [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, 0],
      [{ name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, { name: 'b', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, -1],
      [{ name: 'b', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, { name: 'a', categoryId: 'cat1', shortName: 'a' } as unknown as IItem, 1]
    ])('should compare by category, a string property and name', (item1: IItem, item2: IItem, expectedComparisonValue: number) => {
      // Act
      const sortingValue = compareByItemString(item1, item1.shortName, item2, item2.shortName)

      // Assert
      expect(sortingValue).toBe(expectedComparisonValue)
    })
  })

  describe('setSortingProperty()', () => {
    it.each([
      ['name', undefined, SortingOrder.desc, -1],
      ['name', SortingOrder.asc, SortingOrder.asc, 1],
      ['price', undefined, SortingOrder.asc, 2],
      ['price', SortingOrder.desc, SortingOrder.desc, -2]
    ])('should set the sorting property and get the comparison function', (property: string, sortingOrder: SortingOrder | undefined, expectedSortingOrder: SortingOrder, expectedComparisonResult: number) => {
      // Arrange
      let sortingData: SortingData<IItem> | undefined = new SortingData()
      const sortingFunctions: IItemSortingFunctionList = {
        functions: {
          name: {
            comparisonFunction: () => {
              return 1
            },
            comparisonValueObtentionPromise: i => Promise.resolve(i.name)
          },
          price: {
            comparisonFunction: () => 2,
            comparisonValueObtentionPromise: i => Promise.resolve(i.prices[0].valueInMainCurrency)
          }
        },
        itemCategoryIds: [ItemCategoryId.other]
      }
      const sortService = new SortingService()

      // Act
      sortingData = sortService.setSortingProperty(sortingData, sortingFunctions, property, sortingOrder)
      const comparison = sortingData!.sortingFunction.comparisonFunction({} as unknown as IItem, 0, {} as unknown as IItem, 0)

      // Assert
      expect(sortingData!.property).toBe(property)
      expect(sortingData!.order).toBe(expectedSortingOrder)
      expect(comparison).toBe(expectedComparisonResult)
    })

    it('should return original sorting data when no comparison function is configured for the property', () => {
      // Arrange
      let sortingData: SortingData<IItem> | undefined = new SortingData()
      sortingData.property = 'name'
      sortingData.order = SortingOrder.desc

      const sortingFunctions: IItemSortingFunctionList = {
        functions: {},
        itemCategoryIds: [ItemCategoryId.other]
      }
      const sortService = new SortingService()

      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      // Act
      sortingData = sortService.setSortingProperty(sortingData, sortingFunctions, 'invalid')

      // Assert
      expect(sortingData.property).toBe('name')
      expect(sortingData.order).toBe(SortingOrder.desc)
      verify(logServiceMock.logError('message.sortingFunctionNotFound', anything())).once()
    })
  })

  describe('sortAsync()', () => {
    it('should sort an array or build summaries', async () => {
      // Arrange
      let sortingData: SortingData<IBuildSummary> | undefined = new SortingData()
      const sortingFunctions: IBuildSortingFunctionList = {
        functions: {
          ergonomics: {
            comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1 as unknown as Record<string, unknown>, bs1v, bs2 as unknown as Record<string, unknown>, bs2v),
            comparisonValueObtentionPromise: bs => Promise.resolve(bs.ergonomics)
          }
        }
      }
      const buildSummaries = [
        { ergonomics: 10, name: 'e' } as IBuildSummary,
        { ergonomics: 20, name: 'f' } as IBuildSummary,
        { ergonomics: 10, name: 'b' } as IBuildSummary,
        { ergonomics: 10, name: 'f' } as IBuildSummary,
        { ergonomics: 10, name: 'i' } as IBuildSummary
      ]
      const sortingService = new SortingService()

      // Act
      sortingData = sortingService.setSortingProperty(sortingData, sortingFunctions, 'ergonomics')
      const result = await sortingService.sortAsync(buildSummaries, sortingData!)

      // Assert
      expect(result).toStrictEqual([
        { ergonomics: 10, name: 'b' } as IBuildSummary,
        { ergonomics: 10, name: 'e' } as IBuildSummary,
        { ergonomics: 10, name: 'f' } as IBuildSummary,
        { ergonomics: 10, name: 'i' } as IBuildSummary,
        { ergonomics: 20, name: 'f' } as IBuildSummary
      ])
    })

    it('should sort an array or items', async () => {
      // Arrange
      let sortingData: SortingData<IItem> | undefined = new SortingData()
      const sortingFunctions: IItemSortingFunctionList = {
        functions: {
          shortName: {
            comparisonFunction: (i1, iv1, i2, iv2) => compareByItemString(i1, iv1, i2, iv2),
            comparisonValueObtentionPromise: i => Promise.resolve(i.shortName)
          }
        },
        itemCategoryIds: [ItemCategoryId.other]
      }
      const items = [
        { categoryId: 'cat1', shortName: 'e' } as unknown as IItem,
        { categoryId: 'cat2', shortName: 'f' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'b' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'f' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'i' } as unknown as IItem
      ]
      const sortingService = new SortingService()

      // Act
      sortingData = sortingService.setSortingProperty(sortingData, sortingFunctions, 'shortName')
      const result = await sortingService.sortAsync(items, sortingData!)

      // Assert
      expect(result).toStrictEqual([
        { categoryId: 'cat1', shortName: 'b' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'e' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'f' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'i' } as unknown as IItem,
        { categoryId: 'cat2', shortName: 'f' } as unknown as IItem
      ])
    })
  })
})