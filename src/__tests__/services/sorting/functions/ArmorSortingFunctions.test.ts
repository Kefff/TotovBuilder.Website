import { IArmor } from '../../../../models/item/IArmor'
import { ArmorSortingFunctions } from '../../../../services/sorting/functions/ArmorSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsPercentageModifier']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsPercentageModifier: 1
    } as IArmor

    const item2 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsPercentageModifier: 2
    } as IArmor

    const sortingFunctions = new ArmorSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})