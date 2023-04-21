import { IRangedWeapon } from '../../../../models/item/IRangedWeapon'
import { RangedWeaponSortingFunctions } from '../../../../services/sorting/functions/RangedWeaponSortingFunctions'

describe('setSortingProperty()', () => {
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
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      caliber: 'a',
      categoryId: 'cat',
      ergonomics: 1,
      fireRate: 1,
      horizontalRecoil: 1,
      presetErgonomics: isPreset ? 1 : undefined,
      presetHorizontalRecoil: isPreset ? 1 : undefined,
      presetVerticalRecoil: isPreset ? 1 : undefined,
      verticalRecoil: 1
    } as IRangedWeapon

    const item2 = {
      caliber: 'b',
      categoryId: 'cat',
      ergonomics: 2,
      fireRate: 2,
      horizontalRecoil: 2,
      presetErgonomics: isPreset ? 2 : undefined,
      presetHorizontalRecoil: isPreset ? 2 : undefined,
      presetVerticalRecoil: isPreset ? 2 : undefined,
      verticalRecoil: 2
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