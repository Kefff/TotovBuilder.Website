import { IArmorMod } from '../../../../models/item/IArmorMod'
import { ArmorModSortingFunctions } from '../../../../services/sorting/functions/ArmorModSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([
    ['armorClass', false],
    ['armorClass', true],
    ['durability', false],
    ['durability', true],
    ['ergonomicsPercentageModifier', false],
    ['ergonomicsPercentageModifier', true]
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsPercentageModifier: 1,
      presetErgonomicsPercentageModifier: isPreset ? 1 : undefined
    } as IArmorMod

    const item2 = {
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsPercentageModifier: 2,
      presetErgonomicsPercentageModifier: isPreset ? 2 : undefined
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