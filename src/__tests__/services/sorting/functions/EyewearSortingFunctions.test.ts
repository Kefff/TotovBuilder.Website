import { IEyewear } from '../../../../models/item/IEyewear'
import { EyewearSortingFunctions } from '../../../../services/sorting/functions/EyewearSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([['blindnessProtectionPercentage']])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      blindnessProtectionPercentage: 1
    } as IEyewear

    const item2 = {
      categoryId: 'cat',
      blindnessProtectionPercentage: 2
    } as IEyewear

    const sortingFunctions = new EyewearSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})