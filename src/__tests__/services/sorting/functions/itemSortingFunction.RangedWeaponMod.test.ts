import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IRangedWeaponMod } from '../../../../models/item/IRangedWeaponMod'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { RangedWeaponModSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyModifierPercentage', false],
    ['accuracyModifierPercentage', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['recoilModifierPercentage', false],
    ['recoilModifierPercentage', true]
  ])('should sort by %s', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      accuracyModifierPercentage: 2,
      categoryId: ItemCategoryId.rangedWeaponMod,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      recoilModifierPercentage: 2
    } as IRangedWeaponMod

    const item2 = {
      accuracyModifierPercentage: 1,
      categoryId: ItemCategoryId.rangedWeaponMod,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      recoilModifierPercentage: 1
    } as IRangedWeaponMod

    let sortingData: FilterAndSortingData<IRangedWeaponMod> | undefined = new FilterAndSortingData(RangedWeaponModSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})