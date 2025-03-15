import { instance, mock } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { FilterAndSortingDataType } from '../../../models/utils/FilterAndSortingData'
import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import ItemFilterAndSortingData from '../../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../../models/utils/SortingOrder'
import { LogService } from '../../../services/LogService'
import Services from '../../../services/repository/Services'
import { SortingService, compareByElementName, compareByNumber, compareByString } from '../../../services/sorting/SortingService'
import { IBuildSortingFunctionList, IItemSortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import { AmmunitionSortingFunctions, ArmorModSortingFunctions, ArmorSortingFunctions, BackpackSortingFunctions, ContainerSortingFunctions, EyewearSortingFunctions, GrenadeSortingFunctions, HeadwearSortingFunctions, ItemSortingFunctions, MagazineSortingFunctions, MeleeWeaponSortingFunctions, ModSortingFunctions, RangedWeaponModSortingFunctions, RangedWeaponSortingFunctions, VestSortingFunctions } from '../../../services/sorting/functions/itemSortingFunctions'

describe('SortingService', () => {
  describe('compareByElementName', () => {
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

  describe('getSortingFunctionsFromItemCategory', () => {
    it.each([
      [undefined, ItemSortingFunctions],
      [ItemCategoryId.ammunition, AmmunitionSortingFunctions],
      [ItemCategoryId.armband, ItemSortingFunctions],
      [ItemCategoryId.armor, ArmorSortingFunctions],
      [ItemCategoryId.armorMod, ArmorModSortingFunctions],
      [ItemCategoryId.backpack, BackpackSortingFunctions],
      [ItemCategoryId.container, ContainerSortingFunctions],
      [ItemCategoryId.currency, ItemSortingFunctions],
      [ItemCategoryId.eyewear, EyewearSortingFunctions],
      [ItemCategoryId.faceCover, ItemSortingFunctions],
      [ItemCategoryId.grenade, GrenadeSortingFunctions],
      [ItemCategoryId.headphones, ItemSortingFunctions],
      [ItemCategoryId.headwear, HeadwearSortingFunctions],
      [ItemCategoryId.magazine, MagazineSortingFunctions],
      [ItemCategoryId.mainWeapon, RangedWeaponSortingFunctions],
      [ItemCategoryId.meleeWeapon, MeleeWeaponSortingFunctions],
      [ItemCategoryId.mod, ModSortingFunctions],
      [ItemCategoryId.notFound, ItemSortingFunctions],
      [ItemCategoryId.other, ItemSortingFunctions],
      [ItemCategoryId.rangedWeaponMod, RangedWeaponModSortingFunctions],
      [ItemCategoryId.secondaryWeapon, RangedWeaponSortingFunctions],
      [ItemCategoryId.securedContainer, ContainerSortingFunctions],
      [ItemCategoryId.special, ItemSortingFunctions],
      [ItemCategoryId.vest, VestSortingFunctions]
    ])('should get the sorting functions of an item category (%s)', (itemCategoryId: ItemCategoryId | undefined, expected: IItemSortingFunctionList) => {
      // Arrange
      const service = new SortingService()

      // Act
      const sortingFunctions = service.getSortingFunctionsFromItemCategory(itemCategoryId)

      // Assert
      expect(sortingFunctions).toStrictEqual(expected)
    })
  })

  describe('setSortingProperty', () => {
    it.each([
      ['name', undefined, SortingOrder.desc, -1],
      ['name', SortingOrder.asc, SortingOrder.asc, 1],
      ['price', undefined, SortingOrder.asc, 2],
      ['price', SortingOrder.desc, SortingOrder.desc, -2]
    ])('should set the sorting property and get the comparison function', (property: string, sortingOrder: SortingOrder | undefined, expectedSortingOrder: SortingOrder, expectedComparisonResult: number) => {
      // Arrange
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
            comparisonValueObtentionPromise: i => Promise.resolve((i as IItem).prices[0].valueInMainCurrency)
          }
        },
        itemCategoryIds: [ItemCategoryId.other]
      }
      const sortingData = new FilterAndSortingDataImplementation(sortingFunctions)

      // Act
      sortingData.property = property

      if (sortingOrder != null) {
        sortingData.order = sortingOrder
      }

      const comparison = sortingData.currentSortingFunction.comparisonFunction({} as unknown as IItem, 0, {} as unknown as IItem, 0) * sortingData.order

      // Assert
      expect(sortingData!.property).toBe(property)
      expect(sortingData!.order).toBe(expectedSortingOrder)
      expect(comparison).toBe(expectedComparisonResult)
    })

    it('should return original sorting data when no comparison function is configured for the property', () => {
      // Arrange
      const sortingFunctions: IItemSortingFunctionList = {
        functions: {},
        itemCategoryIds: [ItemCategoryId.other]
      }
      const sortingData = new FilterAndSortingDataImplementation(sortingFunctions)
      sortingData.property = 'name'
      sortingData.order = SortingOrder.desc

      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      // Act
      sortingData.property = 'invalid'

      // Assert
      expect(sortingData.property).toBe('name')
      expect(sortingData.order).toBe(SortingOrder.desc)
    })
  })

  describe('sortAsync', () => {
    it('should sort an array or build summaries', async () => {
      // Arrange
      const sortingFunctions: IBuildSortingFunctionList = {
        functions: {
          ergonomics: {
            comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1, bs1v, bs2, bs2v),
            comparisonValueObtentionPromise: bs => Promise.resolve((bs as IBuildSummary).ergonomics)
          }
        }
      }
      const sortingData = new FilterAndSortingDataImplementation(sortingFunctions)
      const buildSummaries = [
        { ergonomics: 10, name: 'e' } as IBuildSummary,
        { ergonomics: 20, name: 'f' } as IBuildSummary,
        { ergonomics: 10, name: 'b' } as IBuildSummary,
        { ergonomics: 10, name: 'f' } as IBuildSummary,
        { ergonomics: 10, name: 'i' } as IBuildSummary
      ]
      const sortingService = new SortingService()

      // Act
      sortingData.property = 'ergonomics'
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

    it('should sort an array of items', async () => {
      // Arrange
      const sortingFunctions: IItemSortingFunctionList = {
        functions: {
          shortName: {
            comparisonFunction: (i1, iv1, i2, iv2) => compareByString(i1, iv1, i2, iv2),
            comparisonValueObtentionPromise: i => Promise.resolve((i as IItem).shortName)
          }
        },
        itemCategoryIds: [ItemCategoryId.other]
      }
      const sortingData = new FilterAndSortingDataImplementation(sortingFunctions)
      const items = [
        { categoryId: 'cat1', shortName: 'e', name: 'e' } as unknown as IItem,
        { categoryId: 'cat2', shortName: 'f', name: 'f2' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'b', name: 'b' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'f', name: 'f1' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'i', name: 'i' } as unknown as IItem
      ]
      const sortingService = new SortingService()

      // Act
      sortingData.property = 'shortName'
      const result = await sortingService.sortAsync(items, sortingData)

      // Assert
      expect(result).toStrictEqual([
        { categoryId: 'cat1', shortName: 'b', name: 'b' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'e', name: 'e' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'f', name: 'f1' } as unknown as IItem,
        { categoryId: 'cat2', shortName: 'f', name: 'f2' } as unknown as IItem,
        { categoryId: 'cat1', shortName: 'i', name: 'i' } as unknown as IItem
      ])
    })
  })
})

class FilterAndSortingDataImplementation extends ItemFilterAndSortingData {
  public type: FilterAndSortingDataType = FilterAndSortingDataType.item
}