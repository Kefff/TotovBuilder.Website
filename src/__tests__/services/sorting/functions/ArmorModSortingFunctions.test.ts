import { IArmorMod } from '../../../../models/item/IArmorMod'
import { SortingService } from '../../../../services/sorting/SortingService'
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
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsPercentageModifier: 2,
      presetErgonomicsPercentageModifier: isPreset ? 2 : undefined
    } as IArmorMod

    const item2 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsPercentageModifier: 1,
      presetErgonomicsPercentageModifier: isPreset ? 1 : undefined
    } as IArmorMod

    const sortingService = new SortingService<IArmorMod>(ArmorModSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})