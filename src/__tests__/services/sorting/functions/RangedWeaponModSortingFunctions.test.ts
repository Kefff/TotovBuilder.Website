import { IRangedWeaponMod } from '../../../../models/item/IRangedWeaponMod'
import { SortingService } from '../../../../services/sorting/SortingService'
import { RangedWeaponModSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponModSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyPercentageModifier', false],
    ['accuracyPercentageModifier', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['recoilPercentageModifier', false],
    ['recoilPercentageModifier', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      accuracyPercentageModifier: 2,
      categoryId: 'cat',
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      recoilPercentageModifier: 2
    } as IRangedWeaponMod

    const item2 = {
      accuracyPercentageModifier: 1,
      categoryId: 'cat',
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      recoilPercentageModifier: 1
    } as IRangedWeaponMod

    const sortingService = new SortingService(RangedWeaponModSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})