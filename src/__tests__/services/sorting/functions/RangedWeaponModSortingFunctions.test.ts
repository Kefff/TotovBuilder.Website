import { IRangedWeaponMod } from '../../../../models/item/IRangedWeaponMod'
import { RangedWeaponModSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponModSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['accuracyPercentageModifier', false],
    ['accuracyPercentageModifier', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['recoilPercentageModifier', false],
    ['recoilPercentageModifier', true]
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      accuracyPercentageModifier: 1,
      categoryId: 'cat',
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      recoilPercentageModifier: 1
    } as IRangedWeaponMod

    const item2 = {
      accuracyPercentageModifier: 2,
      categoryId: 'cat',
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      recoilPercentageModifier: 2
    } as IRangedWeaponMod

    const sortingFunctions = new RangedWeaponModSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})