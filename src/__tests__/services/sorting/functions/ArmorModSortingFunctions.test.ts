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
    ['ergonomicsPercentageModifier', true],
    ['movementSpeedPercentageModifier', false],
    ['movementSpeedPercentageModifier', true],
    ['turningSpeedPercentageModifier', false],
    ['turningSpeedPercentageModifier', true]
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsPercentageModifier: 2,
      movementSpeedPercentageModifier: 2,
      presetWearableModifiers: isPreset
        ? {
          ergonomicsPercentageModifierWithMods: 20,
          movementSpeedPercentageModifierWithMods: 20,
          turningSpeedPercentageModifierWithMods: 20
        }
        : undefined,
      turningSpeedPercentageModifier: 2
    } as IArmorMod

    const item2 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsPercentageModifier: 1,
      movementSpeedPercentageModifier: 1,
      presetWearableModifiers: isPreset
        ? {
          ergonomicsPercentageModifierWithMods: 10,
          movementSpeedPercentageModifierWithMods: 10,
          turningSpeedPercentageModifierWithMods: 10
        }
        : undefined,
      turningSpeedPercentageModifier: 1
    } as IArmorMod

    const sortingService = new SortingService<IArmorMod>(ArmorModSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})