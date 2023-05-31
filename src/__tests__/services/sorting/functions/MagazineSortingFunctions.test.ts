import { IMagazine } from '../../../../models/item/IMagazine'
import { MagazineSortingFunctions } from '../../../../services/sorting/functions/MagazineSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['checkSpeedPercentageModifier', false],
    ['checkSpeedPercentageModifier', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['loadSpeedPercentageModifier', false],
    ['loadSpeedPercentageModifier', true]
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      checkSpeedPercentageModifier: 1,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      loadSpeedPercentageModifier: 1
    } as IMagazine

    const item2 = {
      categoryId: 'cat',
      checkSpeedPercentageModifier: 2,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      loadSpeedPercentageModifier: 2
    } as IMagazine

    const sortingFunctions = new MagazineSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})