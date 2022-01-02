import { IRangedWeapon } from '../../../../models/item/IRangedWeapon'
import { RangedWeaponSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['caliber'],
    ['fireRate'],
    ['ergonomics'],
    ['verticalRecoil'],
    ['horizontalRecoil']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      caliber: 'a',
      fireRate: 1,
      ergonomics: 1,
      verticalRecoil: 1,
      horizontalRecoil: 1
    } as IRangedWeapon

    const item2 = {
      categoryId: 'cat',
      caliber: 'b',
      fireRate: 2,
      ergonomics: 2,
      verticalRecoil: 2,
      horizontalRecoil: 2
    } as IRangedWeapon

    const sortingFunctions = new RangedWeaponSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})