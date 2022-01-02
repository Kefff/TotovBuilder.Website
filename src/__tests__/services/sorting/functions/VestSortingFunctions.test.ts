import { IVest } from '../../../../models/item/IVest'
import { VestSortingFunctions } from '../../../../services/sorting/functions/VestSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsPercentageModifier'],
    ['capacity']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsPercentageModifier: 1,
      capacity: 1
    } as IVest

    const item2 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsPercentageModifier: 2,
      capacity: 2
    } as IVest

    const sortingFunctions = new VestSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})