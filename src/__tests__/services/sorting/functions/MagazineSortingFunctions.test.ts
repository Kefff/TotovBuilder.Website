import { IMagazine } from '../../../../models/item/IMagazine'
import { MagazineSortingFunctions } from '../../../../services/sorting/functions/MagazineSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['loadSpeedPercentageModifier'],
    ['checkSpeedPercentageModifier'],
    ['ergonomicsModifier']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      loadSpeedPercentageModifier: 1,
      checkSpeedPercentageModifier: 1,
      ergonomicsModifier: 1
    } as IMagazine

    const item2 = {
      categoryId: 'cat',
      loadSpeedPercentageModifier: 2,
      checkSpeedPercentageModifier: 2,
      ergonomicsModifier: 2
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