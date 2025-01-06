import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IRangedWeapon } from '../../../../models/item/IRangedWeapon'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { RangedWeaponSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['caliber', false],
    ['caliber', true],
    ['ergonomics', false],
    ['ergonomics', true],
    ['fireRate', false],
    ['fireRate', true],
    ['horizontalRecoil', false],
    ['horizontalRecoil', true],
    ['verticalRecoil', false],
    ['verticalRecoil', true]
  ])('should sort by %s', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      caliber: 'b',
      categoryId: ItemCategoryId.mainWeapon,
      ergonomics: 2,
      fireRate: 2,
      horizontalRecoil: 2,
      presetRangedWeaponModifiers: {
        ergonomics: isPreset ? 2 : undefined,
        horizontalRecoil: isPreset ? 2 : undefined,
        verticalRecoil: isPreset ? 2 : undefined
      },
      verticalRecoil: 2
    } as IRangedWeapon

    const item2 = {
      caliber: 'a',
      categoryId: ItemCategoryId.mainWeapon,
      ergonomics: 1,
      fireRate: 1,
      horizontalRecoil: 1,
      presetRangedWeaponModifiers: {
        ergonomics: isPreset ? 1 : undefined,
        horizontalRecoil: isPreset ? 1 : undefined,
        verticalRecoil: isPreset ? 1 : undefined
      },
      verticalRecoil: 1
    } as IRangedWeapon

    const sortingData: FilterAndSortingData<IRangedWeapon> | undefined = new ItemFilterAndSortingData(RangedWeaponSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})