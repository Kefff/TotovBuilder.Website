import { describe, expect, it } from 'vitest'
import { IRangedWeaponMod } from '../../../../models/item/IRangedWeaponMod'
import { SortingService } from '../../../../services/sorting/SortingService'
import { RangedWeaponModSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponModSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyModifierPercentage', false],
    ['accuracyModifierPercentage', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['recoilModifierPercentage', false],
    ['recoilModifierPercentage', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      accuracyModifierPercentage: 2,
      categoryId: 'cat',
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      recoilModifierPercentage: 2
    } as IRangedWeaponMod

    const item2 = {
      accuracyModifierPercentage: 1,
      categoryId: 'cat',
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      recoilModifierPercentage: 1
    } as IRangedWeaponMod

    const sortingService = new SortingService(RangedWeaponModSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})