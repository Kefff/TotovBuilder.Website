import { IMeleeWeapon } from '../../../../models/item/IMeleeWeapon'
import { MeleeWeaponSortingFunctions } from '../../../../services/sorting/functions/MeleeWeaponSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['stabDamage'],
    ['chopDamage'],
    ['hitRadius']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      stabDamage: 1,
      chopDamage: 1,
      hitRadius: 1
    } as IMeleeWeapon

    const item2 = {
      categoryId: 'cat',
      stabDamage: 2,
      chopDamage: 2,
      hitRadius: 2
    } as IMeleeWeapon

    const sortingFunctions = new MeleeWeaponSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})