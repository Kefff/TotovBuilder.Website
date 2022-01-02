import { IRangedWeaponMod } from '../../../../models/item/IRangedWeaponMod'
import { RangedWeaponModSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponModSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['ergonomicsModifier'],
    ['recoilPercentageModifier'],
    ['accuracyPercentageModifier']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsModifier: 1,
      recoilPercentageModifier: 1,
      accuracyPercentageModifier: 1
    } as IRangedWeaponMod

    const item2 = {
      categoryId: 'cat',
      ergonomicsModifier: 2,
      recoilPercentageModifier: 2,
      accuracyPercentageModifier: 2
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