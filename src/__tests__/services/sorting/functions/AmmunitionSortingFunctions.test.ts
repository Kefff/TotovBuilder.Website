import { IAmmunition } from '../../../../models/item/IAmmunition'
import { AmmunitionSortingFunctions } from '../../../../services/sorting/functions/AmmunitionSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['fleshDamage'],
    ['penetrationPower'],
    ['fragmentationChancePercentage'],
    ['recoilPercentageModifier'],
    ['accuracyPercentageModifier']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      fleshDamage: 1,
      penetrationPower: 1,
      fragmentationChancePercentage: 1,
      recoilPercentageModifier: 1,
      accuracyPercentageModifier: 1
    } as IAmmunition

    const item2 = {
      categoryId: 'cat',
      fleshDamage: 2,
      penetrationPower: 2,
      fragmentationChancePercentage: 2,
      recoilPercentageModifier: 2,
      accuracyPercentageModifier: 2
    } as IAmmunition

    const sortingFunctions = new AmmunitionSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})