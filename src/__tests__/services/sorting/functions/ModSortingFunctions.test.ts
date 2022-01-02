import { IMod } from '../../../../models/item/IMod'
import { ModSortingFunctions } from '../../../../services/sorting/functions/ModSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([['ergonomicsModifier']])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsModifier: 1
    } as IMod

    const item2 = {
      categoryId: 'cat',
      ergonomicsModifier: 2
    } as IMod

    const sortingFunctions = new ModSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})