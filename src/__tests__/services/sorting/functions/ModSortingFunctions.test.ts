import { IMod } from '../../../../models/item/IMod'
import { ModSortingFunctions } from '../../../../services/sorting/functions/ModSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true]
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined
    } as IMod

    const item2 = {
      categoryId: 'cat',
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined
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