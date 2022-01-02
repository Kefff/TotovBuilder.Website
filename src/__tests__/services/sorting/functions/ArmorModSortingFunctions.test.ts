import { IArmorMod } from '../../../../models/item/IArmorMod'
import { ArmorModSortingFunctions } from '../../../../services/sorting/functions/ArmorModSortingFunctions'

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
    } as IArmorMod

    const item2 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsPercentageModifier: 2
    } as IArmorMod

    const sortingFunctions = new ArmorModSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})