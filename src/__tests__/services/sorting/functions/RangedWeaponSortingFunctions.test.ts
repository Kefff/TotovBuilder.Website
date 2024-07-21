import { describe, expect, it } from 'vitest'
import { IRangedWeapon } from '../../../../models/item/IRangedWeapon'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
import { RangedWeaponSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponSortingFunctions'

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
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      caliber: 'b',
      categoryId: 'cat',
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
      categoryId: 'cat',
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

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, RangedWeaponSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})